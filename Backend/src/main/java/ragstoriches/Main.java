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

        // 3. Start Server & Delegate Routes
        Javalin app = Javalin.create(config -> {
            config.bundledPlugins.enableCors(cors -> {
                // SECURITY: Replace anyHost() with your actual Netlify URL
                cors.addRule(it -> it.allowHost("https://remarkable-hotteok-9a5dc2.netlify.app"));
            });

            new AppRouter(auth, game, geminiKey).setupRoutes(config);

        }).start("0.0.0.0", port); // Use the dynamic port variable here

        Runtime.getRuntime().addShutdownHook(new Thread(app::stop));
        System.out.println("🚀 Backend is LISTENING on port " + port);
    }

    private static String getEnv(Dotenv dotenv, String key) {
        String val = dotenv.get(key);
        return (val != null) ? val : System.getenv(key);
    }
}