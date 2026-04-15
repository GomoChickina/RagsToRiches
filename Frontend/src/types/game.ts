export const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8081/api";

export interface GameItem {
  id: string;
  name: string;
  type: "outfit" | "hat" | "glasses" | "accessory";
  price: number;
  knowledgeReq: number;
  description: string;
}

export interface BackendStats {
  money: number;
  happiness: number;
  financeKnowledge: number;
}

export interface BackendUser {
  id: string;
  name: string;
  email?: string;
  appearance: {
    outfit: string;
    hat: string;
    glasses: string;
    accessory: string;
    extraDetail?: string;
  };
  inventory: string[];
  stats: BackendStats;
  overallScore: number;
}

export type PlayerCharacter = BackendUser;

export interface Effect {
  money: string | number; // Make sure this accepts strings for your "+/++" logic
  happiness: string | number;
  financeKnowledge: string | number;
}

export interface Choice {
  impactDescription?: string;
  text: string;
  effect: Effect;
}

export interface SituationCard {
  id?: string | number;
  _id?: string;
  situationId: number;
  type?: 'situation' | 'narrative'; // <-- NEW
  title?: string; // <-- NEW
  year?: number;  // <-- NEW
  scenario: string;
  options: Choice[]; // This will be an empty array for narratives
}

export type CardCategory = "income" | "expense" | "savings" | "investment";

export interface BudgetCard {
  id: string;
  name: string;
  category: CardCategory;
  amount: number;
  description: string;
  effect: string;
  icon: string;
  rarity: "common" | "rare" | "epic" | "legendary";
}

export interface GameState {
  stats: BackendStats;
  round: number;
  maxRounds: number;
  currentSituation: SituationCard | null;
  monthlyIncome?: number;
  monthlyExpenses?: number;
}

export interface EvilCharacter {
  name: string;
  type: "debt_monster" | "impulse_demon" | "scam_spirit";
  power: number;
  icon: string;
  taunt: string;
}

export type CharacterOutfit = string;
export type CharacterAccessory = string;

export interface CustomizationItem {
  id: string;
  name: string;
  type: "outfit" | "house" | "accessory";
  value: string;
  cost: number;
  icon: string;
  description: string;
  unlocked: boolean;
}
