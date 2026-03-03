package ragstoriches;

import io.github.cdimascio.dotenv.Dotenv;
import io.javalin.Javalin;
import ragstoriches.Api.AuthApi;
import ragstoriches.Api.GameApi;
import ragstoriches.database.MongoDB;
import ragstoriches.logic.RagsToRichesCalculator;

public class Main {
    public static void main(String[] args) {
        // 1. Config & Environment
        Dotenv dotenv = Dotenv.configure().ignoreIfMissing().load();
        String mongoUri = getEnv(dotenv, "MONGO_URI");
        String jwtSecret = getEnv(dotenv, "JWT_SECRET");
        String geminiKey = getEnv(dotenv, "GEMINI_API_KEY"); // You'll need this for the bot!

        if (mongoUri == null) {
            System.err.println("❌ ERROR: MONGO_URI is not set!");
            System.exit(1);
        }

        // 2. Initializations
        MongoDB.init(mongoUri);
        AuthApi auth = new AuthApi(jwtSecret != null ? jwtSecret : "fallback-secret");
        GameApi game = new GameApi(new RagsToRichesCalculator());

        // 3. Start Server & Delegate Routes
        Javalin app = Javalin.create(config -> {
            config.bundledPlugins.enableCors(cors -> cors.addRule(it -> it.anyHost()));

            // WE MOVED ALL ROUTES TO THE ROUTER CLASS
            new AppRouter(auth, game, geminiKey).setupRoutes(config);

        }).start("0.0.0.0", 8080);

        Runtime.getRuntime().addShutdownHook(new Thread(app::stop));
        System.out.println("🚀 Backend is LISTENING on http://localhost:8080/api/");
    }

    private static String getEnv(Dotenv dotenv, String key) {
        String val = dotenv.get(key);
        return (val != null) ? val : System.getenv(key);
    }
}