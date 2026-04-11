package ragstoriches.auth;

import java.util.Date;

import org.bson.codecs.pojo.annotations.BsonId;
import org.bson.types.ObjectId;

public class AuthUser {
    @BsonId
    public ObjectId id;
    public String email;
    public String passwordHash;
    public Date createdAt;
    public Date updatedAt;

    public AuthUser() {
    }

    public String idString() {
        return id == null ? null : id.toHexString();
    }
}
