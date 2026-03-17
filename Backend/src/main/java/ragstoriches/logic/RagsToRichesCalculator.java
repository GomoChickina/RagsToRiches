package ragstoriches.logic;

import ragstoriches.Card.Effect;
import ragstoriches.StatsCalculator;
import ragstoriches.User;

public class RagsToRichesCalculator implements StatsCalculator {

    @Override
    public void applyEffect(User.Stats stats, Effect effect) {
        if (effect == null || stats == null)
            return;

        // 1. Parse Multipliers
        int pflMult = getSymbolMultiplier(effect.financeKnowledge);
        int hapMult = getSymbolMultiplier(effect.happiness);
        int monMult = getSymbolMultiplier(effect.money);

        // 2. Score Formula
        int totalScore = (8 * pflMult) + (4 * hapMult) + (6 * monMult);

        // 3. Financial Calculation
        double performanceBonus = totalScore * 100.0;
        double explicitCash = parseExplicitMoney(effect.money);
        double netMoneyChange = performanceBonus + explicitCash;

        // 4. Update the NESTED stats object
        stats.money += netMoneyChange;
        stats.happiness += hapMult;
        stats.financeKnowledge += pflMult;

    }

    // --- Helpers (Same as before) ---
    private int getSymbolMultiplier(String text) {
        if (text == null)
            return 0;
        switch (text.trim()) {
            case "++":
                return 2;
            case "+":
                return 1;
            case "-":
                return 0;
            case "--":
                return -1;
            case "+++":
                return 3;
            case "---":
                return -2;
            default:
                return 0;
        }
    }

    private double parseExplicitMoney(String text) {
        if (text == null || text.matches("^[\\+\\-]+$"))
            return 0.0;
        try {
            return Double.parseDouble(text);
        } catch (NumberFormatException e) {
            return 0.0;
        }
    }
}