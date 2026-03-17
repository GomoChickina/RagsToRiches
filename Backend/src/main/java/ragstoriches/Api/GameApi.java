package ragstoriches.Api;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.bson.types.ObjectId; // <-- ADDED IMPORT

import com.mongodb.client.MongoCollection;
import com.mongodb.client.model.Filters;
import com.mongodb.client.model.Sorts;

import ragstoriches.Card;
import ragstoriches.GameWardrobe;
import ragstoriches.StatsCalculator;
import ragstoriches.User;
import ragstoriches.database.MongoDB;

public class GameApi {
    private final MongoCollection<Card> cardCollection;
    private final MongoCollection<User> userCollection;
    private final StatsCalculator calculator;

    public static final Map<String, GameWardrobe> ITEM_CATALOG = new HashMap<>();

    static {
        // Outfits
        ITEM_CATALOG.put("business_suit", new GameWardrobe("business_suit", "Wall St Suit", "outfit", 500, 20));
        ITEM_CATALOG.put("cool_hoodie", new GameWardrobe("cool_hoodie", "Designer Hoodie", "outfit", 200, 0));

        // Hats
        ITEM_CATALOG.put("red_cap", new GameWardrobe("red_cap", "Backwards Cap", "hat", 150, 0));
        ITEM_CATALOG.put("grad_cap", new GameWardrobe("grad_cap", "Alumni Cap", "hat", 1000, 50));

        // Accessories
        ITEM_CATALOG.put("gold_chain", new GameWardrobe("gold_chain", "Gold Chain", "accessory", 2000, 0));
        ITEM_CATALOG.put("shades", new GameWardrobe("shades", "Cool Shades", "glasses", 300, 0));
    }

    public GameApi(StatsCalculator calculator) {
        this.calculator = calculator;
        this.cardCollection = MongoDB.getDatabase().getCollection("cards", Card.class);
        this.userCollection = MongoDB.getDatabase().getCollection("users", User.class);
    }

    // --- READS ---

    public List<Card> getAllCards() {
        return cardCollection.find().into(new ArrayList<>());
    }

    // --- UPDATED: Safe ID Fetching ---
    public User getUser(String userId) {
        try {
            // Try searching for a proper MongoDB ObjectId (Real accounts)
            return userCollection.find(Filters.eq("_id", new ObjectId(userId))).first();
        } catch (IllegalArgumentException e) {
            // Fallback: If it's a manual string like "test_user", search as a raw string
            return userCollection.find(Filters.eq("_id", userId)).first();
        }
    }

    public List<User> getLeaderboard() {
        return userCollection.find()
                .sort(Sorts.descending("overallScore")) // Sort by score, not money
                .limit(10)
                .into(new ArrayList<>());
    }

    // --- WRITES ---

    public User createUser(String userId) {
        // Use our new Factory method to ensure stats exist
        User newUser = User.createDefault(userId);
        userCollection.insertOne(newUser);
        return newUser;
    }

    // --- UPDATED: Safe ID Saving ---
    public User saveUser(User user) {
        user.calculateScore(); // Recalculate score before saving

        try {
            // Try updating the real account using ObjectId
            userCollection.replaceOne(Filters.eq("_id", new ObjectId(user.id)), user);
        } catch (IllegalArgumentException e) {
            // Fallback for string-based test accounts
            userCollection.replaceOne(Filters.eq("_id", user.id), user);
        }

        return user;
    }

    // --- GAMEPLAY ---

    public User processChoice(String userId, int situationId, int choiceIndex) {
        // 1. Get User (or create temp if testing)
        User user = getUser(userId);
        if (user == null)
            user = createUser(userId);

        // 2. Get Card
        Card card = cardCollection.find(Filters.eq("situationId", situationId)).first();

        // 3. Apply Effect
        if (card != null && choiceIndex >= 0 && choiceIndex < card.options.size()) {
            Card.Option selectedOption = card.options.get(choiceIndex);

            // ⚠️ PASS THE NESTED STATS OBJECT
            calculator.applyEffect(user.stats, selectedOption.effect);

            // Save immediately
            saveUser(user);
        }

        return user;
    }

    public User buyItem(String userId, String itemId) {
        User user = getUser(userId);
        if (user == null)
            throw new RuntimeException("User not found");

        // Defensive: older users might not have inventory initialized
        if (user.inventory == null) {
            user.inventory = new ArrayList<>();
        }

        GameWardrobe item = ITEM_CATALOG.get(itemId);
        if (item == null)
            throw new RuntimeException("Item not found");

        // Checks
        if (user.inventory.contains(itemId))
            throw new RuntimeException("Already owned");
        if (user.stats.money < item.price)
            throw new RuntimeException("Not enough money");
        if (user.stats.financeKnowledge < item.knowledgeReq)
            throw new RuntimeException("Need more knowledge");

        // Execute
        user.stats.money -= item.price;
        user.inventory.add(itemId);

        return saveUser(user); // Persist to MongoDB
    }

    public User equipItem(String userId, String itemId) {
        User user = getUser(userId);
        if (user == null)
            throw new RuntimeException("User not found");

        // Defensive: older users might not have inventory initialized
        if (user.inventory == null) {
            user.inventory = new ArrayList<>();
        }

        // Validate ownership (allow "default" or "none" items always)
        if (!itemId.contains("default") && !itemId.contains("none") && !user.inventory.contains(itemId)) {
            throw new RuntimeException("You don't own this item");
        }

        // Determine slot based on Catalog or ID naming convention
        GameWardrobe item = ITEM_CATALOG.get(itemId);

        // Simple logic: if item is in catalog, use its type.
        // If it's "none_hat", we infer type is "hat".
        String type = (item != null) ? item.type : "";
        if (itemId.contains("hat"))
            type = "hat";
        if (itemId.contains("glasses"))
            type = "glasses";
        if (itemId.contains("outfit"))
            type = "outfit";
        if (itemId.contains("accessory"))
            type = "accessory";

        switch (type) {
            case "outfit":
                user.appearance.outfit = itemId;
                break;
            case "hat":
                user.appearance.hat = itemId;
                break;
            case "glasses":
                user.appearance.glasses = itemId;
                break;
            case "accessory":
                user.appearance.accessory = itemId;
                break;
        }

        return saveUser(user);
    }

}