package ragstoriches;

import java.util.List;
import org.bson.BsonType;
import org.bson.codecs.pojo.annotations.BsonId;
import org.bson.codecs.pojo.annotations.BsonRepresentation;

public class Card {
    @BsonId
    @BsonRepresentation(BsonType.OBJECT_ID)
    public String _id;

    // MUST BE DOUBLE NOW to handle 10.5, 20.5
    public double situationId; 

    // New narrative fields
    public String type;
    public String title;
    public Integer year;

    public String scenario;
    public List<Option> options;

    public Card() {}

    public static class Option {
        public String text;
        public Effect effect;
        public Option() {}
    }

    public static class Effect {
        public String money;
        public String happiness;
        public String financeKnowledge;
        public Effect() {}
    }
}