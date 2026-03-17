package ragstoriches.Api;

import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.UUID;

import javax.crypto.SecretKey;

import org.mindrot.jbcrypt.BCrypt;

import com.mongodb.client.MongoCollection;
import com.mongodb.client.model.Filters;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import ragstoriches.User;
import ragstoriches.database.MongoDB;

public class AuthApi {

    private final MongoCollection<User> userCollection;
    private final SecretKey jwtKey;

    // Token valid for 30 days
    private static final long JWT_EXPIRY_MS = 30L * 24 * 60 * 60 * 1000;

    public AuthApi(String jwtSecret) {
        this.userCollection = MongoDB.getDatabase().getCollection("users", User.class);
        // Pad/trim secret to 32 bytes for HMAC-SHA256
        byte[] keyBytes = jwtSecret.getBytes(StandardCharsets.UTF_8);
        byte[] paddedKey = new byte[32];
        System.arraycopy(keyBytes, 0, paddedKey, 0, Math.min(keyBytes.length, 32));
        this.jwtKey = Keys.hmacShaKeyFor(paddedKey);
    }

    // ── REGISTER ─────────────────────────────────────────────────────────────
    public AuthResult register(String name, String email, String rawPassword) {
        // 1. Check email not already taken
        User existing = userCollection.find(Filters.eq("email", email)).first();
        if (existing != null) {
            throw new RuntimeException("An account with this email already exists.");
        }

        // 2. Hash password with BCrypt (cost factor 12)
        String hashed = BCrypt.hashpw(rawPassword, BCrypt.gensalt(12));

        // 3. Create user with a fresh UUID
        String userId = UUID.randomUUID().toString();
        User newUser = User.createDefault(userId, name, email, hashed);
        userCollection.insertOne(newUser);

        // 4. Issue JWT
        String token = issueToken(userId);

        return new AuthResult(token, newUser.withoutPassword());
    }

    // ── LOGIN ─────────────────────────────────────────────────────────────────
    public AuthResult login(String email, String rawPassword) {
        // 1. Find user by email
        User user = userCollection.find(Filters.eq("email", email)).first();
        if (user == null) {
            throw new RuntimeException("No account found with that email.");
        }

        // 2. Verify password
        if (user.password == null || !BCrypt.checkpw(rawPassword, user.password)) {
            throw new RuntimeException("Incorrect password.");
        }

        // 3. Issue JWT
        String token = issueToken(user.id);

        return new AuthResult(token, user.withoutPassword());
    }

    // ── TOKEN VERIFICATION (use in middleware) ────────────────────────────────
    public String verifyTokenAndGetUserId(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(jwtKey)
                .build()
                .parseClaimsJws(token)
                .getBody()
                .getSubject();
    }

    // ── PRIVATE HELPERS ───────────────────────────────────────────────────────
    private String issueToken(String userId) {
        return Jwts.builder()
                .setSubject(userId)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + JWT_EXPIRY_MS))
                .signWith(jwtKey, SignatureAlgorithm.HS256)
                .compact();
    }

    // ── RESPONSE WRAPPER ──────────────────────────────────────────────────────
    public static class AuthResult {
        public final String token;
        public final User user;

        public AuthResult(String token, User user) {
            this.token = token;
            this.user = user;
        }
    }
}