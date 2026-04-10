package ragstoriches;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import io.javalin.apibuilder.ApiBuilder;
import io.javalin.config.JavalinConfig;
import ragstoriches.Api.AuthApi;
import ragstoriches.Api.GameApi;

public class AppRouter {
    private final AuthApi auth;
    private final GameApi game;
    private final String geminiKey;

    public AppRouter(AuthApi auth, GameApi game, String geminiKey) {
        this.auth = auth;
        this.game = game;
        this.geminiKey = geminiKey;
    }

    public void setupRoutes(JavalinConfig config) {
        config.router.apiBuilder(() -> {
            ApiBuilder.path("api", () -> {

                // AUTH ROUTES
                ApiBuilder.path("auth", () -> {
                    ApiBuilder.post("register", ctx -> {
                        RegisterRequest req = ctx.bodyAsClass(RegisterRequest.class);
                        try {
                            ctx.json(auth.register(req.name, req.email, req.password));
                        } catch (Exception e) {
                            ctx.status(409).result(e.getMessage());
                        }
                    });

                    ApiBuilder.post("login", ctx -> {
                        LoginRequest req = ctx.bodyAsClass(LoginRequest.class);
                        try {
                            ctx.json(auth.login(req.email, req.password));
                        } catch (Exception e) {
                            ctx.status(401).result(e.getMessage());
                        }
                    });
                });

                // GAME & AI ROUTES
                ApiBuilder.get("cards", ctx -> ctx.status(200).json(game.getAllCards()));

                // Profile (simple user CRUD without auth middleware for now)
                ApiBuilder.get("profile/{userId}", ctx -> {
                    String userId = ctx.pathParam("userId");
                    User user = game.getUser(userId);
                    if (user == null) {
                        ctx.status(404).result("User not found");
                    } else {
                        ctx.json(user.withoutPassword());
                    }
                });

                ApiBuilder.post("profile/save", ctx -> {
                    User req = ctx.bodyAsClass(User.class);
                    User saved = game.saveUser(req);
                    ctx.json(saved.withoutPassword());
                });

                // Leaderboard
                ApiBuilder.get("leaderboard", ctx -> {
                    ctx.json(game.getLeaderboard());
                });

                // Shop routes
                ApiBuilder.get("shop/catalog", ctx -> {
                List<Map<String, Object>> items = new ArrayList<>();
                for (GameWardrobe item : GameApi.ITEM_CATALOG.values()) {
                items.add(Map.of(
                    "id", item.id,
                    "name", item.name,
                    "type", item.type,
                    "price", item.price,
                    "knowledgeReq", item.knowledgeReq,
                    "description", item.description != null ? item.description : ""));
                }
            // Explicitly command Javalin to set a 200 OK status
                ctx.status(200).json(items);
                });

                ApiBuilder.post("shop/buy", ctx -> {
                    ShopRequest req = ctx.bodyAsClass(ShopRequest.class);
                    User updated = game.buyItem(req.userId, req.itemId);
                    ctx.json(updated.withoutPassword());
                });

                ApiBuilder.post("shop/equip", ctx -> {
                    ShopRequest req = ctx.bodyAsClass(ShopRequest.class);
                    User updated = game.equipItem(req.userId, req.itemId);
                    ctx.json(updated.withoutPassword());
                });

                ApiBuilder.post("choose", ctx -> {
                    try {
                        Map<String, Object> body = ctx.bodyAsClass(Map.class);

                        String userId = body.get("userId") != null ? String.valueOf(body.get("userId")) : null;
                        Object situationIdRaw = body.get("situationId");
                        Object choiceIndexRaw = body.get("choiceIndex");

                        if (userId == null || situationIdRaw == null || choiceIndexRaw == null) {
                            ctx.status(400).result("Missing fields: userId, situationId, choiceIndex are required");
                            return;
                        }

                        int situationId = parseIntSafely(situationIdRaw);
                        int choiceIndex = parseIntSafely(choiceIndexRaw);

                        User updatedUser = game.processChoice(userId, situationId, choiceIndex);
                        ctx.json(updatedUser.withoutPassword());
                    } catch (Exception e) {
                        e.printStackTrace();
                        ctx.status(400).result("Invalid choose payload: " + e.getMessage());
                    }
                });

                ApiBuilder.post("explain", ctx -> {
                    ExplainRequest req = ctx.bodyAsClass(ExplainRequest.class);
                    String explanation = GeminiService.callGemini(req, geminiKey);
                    ctx.json(Map.of("explanation", explanation));
                });
            });
        });
    }

    // --- Data Transfer Objects (DTOs) ---
    public static class RegisterRequest {
        public String name;
        public String email;
        public String password;
    }

    public static class LoginRequest {
        public String email;
        public String password;
    }

    public static class ExplainRequest {
        public String situationTitle;
        public String choiceText;
        public String impact;
        // optional: "best", "ok", "worst"
        public String quality;
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

    private static int parseIntSafely(Object value) {
        if (value instanceof Number n) {
            return n.intValue();
        }
        String text = String.valueOf(value).trim();
        if (text.endsWith(".0")) {
            text = text.substring(0, text.length() - 2);
        }
        return Integer.parseInt(text);
    }
}