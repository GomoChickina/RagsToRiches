// src/types/game.ts

export const API_URL = "https://ragstoriches-sqlz.onrender.com/";

// ==========================================
// 1. NEW BACKEND INTEGRATION TYPES
// (Matches your Java User & Card Models)
// ==========================================

export interface BackendStats {
  money: number;
  happiness: number;
  financeKnowledge: number;
}

export interface BackendUser {
  id: string;
  name: string;
  appearance: {
    shirtColor: string;
    extraDetail: string;
  };
  stats: {
    money: number;
    happiness: number;
    financeKnowledge: number;
  };
  overallScore: number;
}

export interface Effect {
  money: number;
  happiness: number;
  financeKnowledge: number;
}

export interface Choice {
  text: string;
  effect: Effect;
}

export interface SituationCard {
  _id: string; // MongoDB ID
  situationId: number;
  scenario: string;
  options: {
    text: string;
    effect: {
      money: string;
      happiness: string;
      financeKnowledge: string;
    };
  }[];
}

// ==========================================
// 2. EXISTING UI TYPES (Preserved)
// ==========================================

export type CardCategory = 'income' | 'expense' | 'savings' | 'investment';

// Kept for backward compatibility if your UI uses it
export interface BudgetCard {
  id: string;
  name: string;
  category: CardCategory;
  amount: number;
  description: string;
  effect: string;
  icon: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

export interface GameState {
  // New Stats (Synced with Backend)
  stats: BackendStats; 
  
  // Legacy UI State (Keep these for animations/rounds)
  round: number;
  maxRounds: number;
  currentSituation: SituationCard | null; // The active card from DB
  
  // Optional: Keep these if your UI calculates monthly flows locally
  monthlyIncome: number;
  monthlyExpenses: number;
}

// ==========================================
// 3. CHARACTER SYSTEM (Merged)
// ==========================================

export type CharacterOutfit = 'default' | 'business' | 'casual' | 'fancy' | 'sporty' | 'student';
export type CharacterHouse = 'apartment' | 'house' | 'mansion' | 'penthouse' | 'cottage';
export type CharacterAccessory = 'none' | 'glasses' | 'hat' | 'watch' | 'briefcase' | 'backpack';
export type CharacterSkinColor = 'light' | 'medium' | 'tan' | 'dark';

export interface CustomizationItem {
  id: string;
  name: string;
  type: 'outfit' | 'house' | 'accessory';
  value: CharacterOutfit | CharacterHouse | CharacterAccessory;
  cost: number;
  icon: string;
  description: string;
  unlocked: boolean;
}

export interface PlayerCharacter {
  // Visuals (Frontend Only)
  outfit: CharacterOutfit;
  house: CharacterHouse;
  accessory: CharacterAccessory;
  skinColor: CharacterSkinColor;
  
  // Data (Synced with Backend)
  id?: string;
  name: string;
  level: number;       // Can map to financeKnowledge / 10
  totalPoints: number; // Maps to overallScore
  stats: BackendStats; // The real numbers from Java
}

export interface EvilCharacter {
  name: string;
  type: 'debt_monster' | 'impulse_demon' | 'scam_spirit';
  power: number;
  icon: string;
  taunt: string;
}