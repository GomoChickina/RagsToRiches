package ragstoriches.database;

import static org.bson.codecs.configuration.CodecRegistries.fromProviders;
import static org.bson.codecs.configuration.CodecRegistries.fromRegistries;
import org.bson.codecs.configuration.CodecRegistry;
import org.bson.codecs.pojo.PojoCodecProvider;

import com.mongodb.ConnectionString;
import com.mongodb.MongoClientSettings;
import com.mongodb.client.MongoClient;
import com.mongodb.client.MongoClients;
import com.mongodb.client.MongoDatabase;

// ❌ REMOVE THIS: import io.github.cdimascio.dotenv.Dotenv;

public class MongoDB {
    private static MongoDatabase database;

    public static void init(String connectionString) {
        // ❌ REMOVE THIS: connectionString = dotenv.get("MONGO_URI");
        // Just use the 'connectionString' that was passed into the method!

        if (connectionString == null || connectionString.isEmpty()) {
            throw new RuntimeException("MongoDB URI cannot be null or empty");
        }

        if (database != null)
            return;

        CodecRegistry pojoCodecRegistry = fromRegistries(
                MongoClientSettings.getDefaultCodecRegistry(),
                fromProviders(PojoCodecProvider.builder().automatic(true).build()));

        MongoClientSettings settings = MongoClientSettings.builder()
                .applyConnectionString(new ConnectionString(connectionString))
                .codecRegistry(pojoCodecRegistry)
                .build();

        MongoClient mongoClient = MongoClients.create(settings);
        // Ensure this matches your docker-compose DB name if specified,
        // but "RagsToRiches" is a safe standard.
        database = mongoClient.getDatabase("RagsToRiches");
    }

    public static MongoDatabase getDatabase() {
        if (database == null) {
            throw new RuntimeException("❌ You must call MongoDB.init(uri) in Main.java first!");
        }
        return database;
    }
}