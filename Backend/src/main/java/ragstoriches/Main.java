package ragstoriches;

// External Libraries
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
        String geminiKey = getEnv(dotenv, "GEMINI_API_KEY");

        // RENDER FIX: Read the "PORT" environment variable assigned by Render
        // Default to 7070 for your local development
        int port = Integer.parseInt(getEnv(dotenv, "PORT") != null ? getEnv(dotenv, "PORT") : "7070");

        if (mongoUri == null) {
            System.err.println("❌ ERROR: MONGO_URI is not set!");
            System.exit(1);
        }

        // 2. Initializations
        MongoDB.init(mongoUri);
        AuthApi auth = new AuthApi(jwtSecret != null ? jwtSecret : "fallback-secret");
        GameApi game = new GameApi(new RagsToRichesCalculator());

        // 3. Initialize Server & Delegate Routes (No .start() here yet)
        Javalin app = Javalin.create(config -> {
            config.bundledPlugins.enableCors(cors -> {
                // Simplified CORS rule that handles everything
                cors.addRule(it -> {
                    // Explicitly trust your local dev server and your production Netlify
                    it.allowHost("http://localhost:5173");
                    it.allowHost("https://remarkable-hotteok-9a5dc2.netlify.app");
                    it.allowCredentials = true;
                });
            });

            new AppRouter(auth, game, geminiKey).setupRoutes(config);
        });

        // --- THE JAVALIN X-RAY (Exception Handler) ---
        app.exception(Exception.class, (e, ctx) -> {
            System.err.println("🔥 JAVALIN HIDDEN EXCEPTION ON ROUTE: " + ctx.path());
            e.printStackTrace();
            ctx.status(500).result("Server Error: " + e.getMessage());
        });

        // 4. Start the server explicitly
        app.start("0.0.0.0", port);

        // 5. Add Shutdown Hook
        Runtime.getRuntime().addShutdownHook(new Thread(app::stop));
        System.out.println("🚀 Backend is LISTENING on port " + port);
    }

    private static String getEnv(Dotenv dotenv, String key) {
        String val = dotenv.get(key);
        return (val != null) ? val : System.getenv(key);
    }
}