package ragstoriches;

import java.util.Map;

import io.github.cdimascio.dotenv.Dotenv;
import io.javalin.Javalin;
import io.javalin.apibuilder.ApiBuilder;
import ragstoriches.Api.AuthApi;
import ragstoriches.Api.GameApi;
import ragstoriches.database.MongoDB;
import ragstoriches.logic.RagsToRichesCalculator;

public class Main {
    public static void main(String[] args) {

        // 1. Load Config (Quiet mode for Docker)
        Dotenv dotenv = Dotenv.configure()
                .ignoreIfMissing()
                .load();

        // 2. Resolve Environment Variables (Check .env first, then System/Docker)
        String mongoUri = getEnv(dotenv, "MONGO_URI");
        String jwtSecret = getEnv(dotenv, "JWT_SECRET");

        // Fail-fast if critical config is missing
        if (mongoUri == null) {
            System.err.println("❌ ERROR: MONGO_URI is not set in .env or system environment!");
            System.exit(1);
        }

        // 3. Initialize DB & Auth
        MongoDB.init(mongoUri);
        AuthApi auth = new AuthApi(jwtSecret != null ? jwtSecret : "fallback-secret-change-me");

        // 4. Initialize Game Logic
        GameApi game = new GameApi(new RagsToRichesCalculator());

        // 5. Start Server & Define Routes
        Javalin app = Javalin.create(config -> {
            // Enable CORS for React frontend
            config.bundledPlugins.enableCors(cors -> {
                cors.addRule(it -> it.anyHost());
            });

            config.router.apiBuilder(() -> {
                ApiBuilder.path("api", () -> {

                    // --- AUTH ROUTES ---
                    ApiBuilder.path("auth", () -> {
                        ApiBuilder.post("register", ctx -> {
                            RegisterRequest req = ctx.bodyAsClass(RegisterRequest.class);
                            if (req.name == null || req.email == null || req.password == null) {
                                ctx.status(400).result("Missing registration details.");
                                return;
                            }
                            try {
                                AuthApi.AuthResult result = auth.register(req.name, req.email, req.password);
                                ctx.json(result);
                            } catch (RuntimeException e) {
                                ctx.status(409).result(e.getMessage());
                            }
                        });

                        ApiBuilder.post("login", ctx -> {
                            LoginRequest req = ctx.bodyAsClass(LoginRequest.class);
                            try {
                                AuthApi.AuthResult result = auth.login(req.email, req.password);
                                ctx.json(result);
                            } catch (RuntimeException e) {
                                ctx.status(401).result(e.getMessage());
                            }
                        });
                    });

                    // --- GAME ROUTES ---
                    ApiBuilder.get("cards", ctx -> ctx.json(game.getAllCards()));

                    ApiBuilder.get("profile/{userId}", ctx -> {
                        String userId = ctx.pathParam("userId");
                        User user = game.getUser(userId);
                        if (user == null) {
                            ctx.status(404).json(Map.of("error", "User not found"));
                            return;
                        }
                        ctx.json(user.withoutPassword());
                    });

                    ApiBuilder.post("profile/save", ctx -> {
                        User incomingUser = ctx.bodyAsClass(User.class);
                        User savedUser = game.saveUser(incomingUser);
                        ctx.json(savedUser.withoutPassword());
                    });

                    ApiBuilder.get("leaderboard", ctx -> ctx.json(game.getLeaderboard()));

                    ApiBuilder.post("choose", ctx -> {
                        ChoiceRequest request = ctx.bodyAsClass(ChoiceRequest.class);
                        User updatedUser = game.processChoice(request.userId, request.situationId, request.choiceIndex);
                        ctx.json(updatedUser.withoutPassword());
                    });

                    // --- SHOP ROUTES ---
                    ApiBuilder.get("shop/catalog", ctx -> ctx.json(GameApi.ITEM_CATALOG));

                    ApiBuilder.post("shop/buy", ctx -> {
                        ShopRequest req = ctx.bodyAsClass(ShopRequest.class);
                        try {
                            User u = game.buyItem(req.userId, req.itemId);
                            ctx.json(u.withoutPassword());
                        } catch (RuntimeException e) {
                            ctx.status(400).result(e.getMessage());
                        }
                    });

                    ApiBuilder.post("shop/equip", ctx -> {
                        ShopRequest req = ctx.bodyAsClass(ShopRequest.class);
                        try {
                            User u = game.equipItem(req.userId, req.itemId);
                            ctx.json(u.withoutPassword());
                        } catch (RuntimeException e) {
                            ctx.status(400).result(e.getMessage());
                        }
                    });
                });
            });

        }).start("0.0.0.0", 8080); // Bind to all interfaces for Docker

        Runtime.getRuntime().addShutdownHook(new Thread(app::stop));
        System.out.println("🚀 Backend is LISTENING on http://localhost:8080/api/");
    }

    /**
     * Helper to safely fetch environment variables from Dotenv or System
     */
    private static String getEnv(Dotenv dotenv, String key) {
        String val = dotenv.get(key);
        return (val != null) ? val : System.getenv(key);
    }

    // --- REQUEST BODY CLASSES ---
    public static class RegisterRequest {
        public String name;
        public String email;
        public String password;
    }

    public static class LoginRequest {
        public String email;
        public String password;
    }

    public static class ChoiceRequest {
        public String userId;
        public int situationId;
        public int choiceIndex;
    }

    public static class ShopRequest {
        public String userId;
        public String itemId;
    }
}