package ragstoriches;

import java.util.ArrayList;
import java.util.List;

import org.bson.codecs.pojo.annotations.BsonId;

public class User {
    @BsonId
    public String id;
    public String name;
    public String email;
    public String password; // BCrypt hashed — never sent to frontend
    public Appearance appearance;
    public Stats stats;
    public double overallScore;
    public List<String> inventory;

    public User() {
    }

    public static User createDefault(String id, String name, String email, String hashedPassword) {
        User u = new User();
        u.id = id;
        u.name = name;
        u.email = email;
        u.password = hashedPassword;
        u.appearance = new Appearance();
        u.inventory = new ArrayList<>();
        u.stats = new Stats();
        u.calculateScore();
        u.inventory.add("default_outfit");
        u.inventory.add("none_hat");
        u.inventory.add("none_glasses");
        u.inventory.add("none_accessory");
        return u;
    }

    // Keep old factory for backwards compat (guest/test users)
    public static User createDefault(String id) {
        return createDefault(id, "Player " + id, null, null);
    }

    public void calculateScore() {
        if (this.stats != null) {
            this.overallScore = this.stats.money
                    + (this.stats.financeKnowledge * 10)
                    + (this.stats.happiness * 5);
        }
    }

    // Strip password before sending to frontend
    public User withoutPassword() {
        this.password = null;
        return this;
    }

    public static class Appearance {
        public String outfit = "default";
        public String hat = "none";
        public String glasses = "none";
        public String accessory = "none";

        public Appearance() {
        }
    }

    public static class Stats {
        public double money = 1000;
        public int financeKnowledge = 0;
        public int happiness = 100;

        public Stats() {
        }
    }
}