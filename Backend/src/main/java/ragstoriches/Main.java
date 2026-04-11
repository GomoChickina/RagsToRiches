package ragstoriches;

import io.github.cdimascio.dotenv.Dotenv;
import io.javalin.Javalin;
import ragstoriches.Api.AuthApi;
import ragstoriches.Api.GameApi;
import ragstoriches.database.MongoDB;
import ragstoriches.logic.RagsToRichesCalculator;

public class Main {
    private static final int DEFAULT_PORT = 8081;

    public static void main(String[] args) {
        Dotenv dotenv = Dotenv.configure()
                .ignoreIfMalformed()
                .ignoreIfMissing()
                .load();

        String mongoUri = firstNonBlank(
                System.getenv("MONGODB_URI"),
                System.getenv("MONGO_URI"),
                dotenv.get("MONGODB_URI"),
                dotenv.get("MONGO_URI"));

        if (mongoUri == null || mongoUri.isBlank()) {
            throw new IllegalStateException("Missing MongoDB connection string. Set MONGODB_URI or MONGO_URI.");
        }

        String jwtSecret = firstNonBlank(
                System.getenv("JWT_SECRET"),
                dotenv.get("JWT_SECRET"));

        if (jwtSecret == null || jwtSecret.isBlank()) {
            throw new IllegalStateException("Missing JWT_SECRET.");
        }

        String geminiKey = firstNonBlank(
                System.getenv("GEMINI_API_KEY"),
                dotenv.get("GEMINI_API_KEY"));

        int port = parsePort(firstNonBlank(
                System.getenv("BACKEND_PORT"),
                System.getenv("PORT"),
                dotenv.get("BACKEND_PORT"),
                dotenv.get("PORT")), DEFAULT_PORT);

        MongoDB.init(mongoUri);

        AuthApi auth = new AuthApi(jwtSecret);
        GameApi game = new GameApi(new RagsToRichesCalculator());

        Javalin app = Javalin.create(config -> {
            config.bundledPlugins.enableCors(cors -> cors.addRule(rule -> rule.anyHost()));
            new AppRouter(auth, game, geminiKey).setupRoutes(config);
        });

        app.exception(Exception.class, (e, ctx) -> {
            e.printStackTrace();
            if (!ctx.res().isCommitted()) {
                ctx.status(500).result("Server Error: " + e.getMessage());
            }
        });

        app.start("0.0.0.0", port);
        Runtime.getRuntime().addShutdownHook(new Thread(app::stop));
        System.out.println("Backend is listening on http://localhost:" + port + "/api/");
    }

    private static String firstNonBlank(String... values) {
        for (String value : values) {
            if (value != null && !value.isBlank()) {
                return value;
            }
        }
        return null;
    }

    private static int parsePort(String value, int fallback) {
        if (value == null || value.isBlank()) {
            return fallback;
        }
        try {
            return Integer.parseInt(value.trim());
        } catch (NumberFormatException ignored) {
            return fallback;
        }
    }
}
