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

public class MongoDB {
    private static MongoDatabase database;

    public static void init(String connectionString) {
        if (database != null) {
            return;
        }

        if (connectionString == null || connectionString.isBlank()) {
            throw new IllegalArgumentException("MongoDB URI cannot be null or empty.");
        }

        CodecRegistry pojoCodecRegistry = fromRegistries(
                MongoClientSettings.getDefaultCodecRegistry(),
                fromProviders(PojoCodecProvider.builder().automatic(true).build()));

        MongoClientSettings settings = MongoClientSettings.builder()
                .applyConnectionString(new ConnectionString(connectionString))
                .codecRegistry(pojoCodecRegistry)
                .build();

        MongoClient mongoClient = MongoClients.create(settings);
        database = mongoClient.getDatabase("RagsToRiches");
    }

    public static MongoDatabase getDatabase() {
        if (database == null) {
            throw new IllegalStateException("MongoDB.init(uri) must be called before getDatabase().");
        }
        return database;
    }
}
