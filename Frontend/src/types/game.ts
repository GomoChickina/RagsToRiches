// src/types/game.ts

import { Key } from "readline";

export const API_URL = "http://localhost:7070/api";

// ==========================================
// 1. SHOP & ITEM TYPES
// ==========================================

export interface GameItem {
  id: string;          // "business_suit", "red_cap"
  name: string;
  type: 'outfit' | 'hat' | 'glasses' | 'accessory';
  price: number;
  knowledgeReq: number; // Min knowledge needed to buy
  description: string;
}

// ==========================================
// 2. BACKEND INTEGRATION TYPES
// (Matches your Java User & Card Models)
// ==========================================

export interface BackendStats {
  money: number;
  happiness: number;
  financeKnowledge: number;
}

// NEW: Matches your Java "User.java" class exactly
export interface BackendUser {
  outfit: string;
  accessory: string;
  id: string;
  name: string;
  email?: string; // Optional, present in Java User class
  appearance: {
    outfit: string;    // "default", "business_suit"
    hat: string;       // "none", "red_cap"
    glasses: string;   // "none", "shades"
    accessory: string; // "none", "gold_chain"
    extraDetail?: string;
  };
  inventory: string[]; // ["default_outfit", "gold_chain"]
  stats: BackendStats;
  overallScore: number;
}

// PlayerCharacter is the Frontend representation of BackendUser
// We can extend it or make it compatible
export type PlayerCharacter = BackendUser

export interface Effect {
  money: number;
  happiness: number;
  financeKnowledge: number;
}

export interface Choice {
  impactDescription?: string;
  text: string;
  effect: Effect;
}

export interface SituationCard {
  title: unknown;
  id: Key;
  _id: string; // MongoDB ID
  situationId: number;
  scenario: string;
  options: {
    text: string;
    effect: {
      money: number; // Changed to number for calculation math
      happiness: number;
      financeKnowledge: number;
    };
  }[];
}

// ==========================================
// 3. LEGACY / UI TYPES
// ==========================================

export type CardCategory = 'income' | 'expense' | 'savings' | 'investment';

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
  stats: BackendStats;
  round: number;
  maxRounds: number;
  currentSituation: SituationCard | null; // The active card from DB
  monthlyIncome?: number;
  monthlyExpenses?: number;
}

// ==========================================
// 4. CHARACTER SYSTEM EXTRAS
// ==========================================

export interface EvilCharacter {
  name: string;
  type: 'debt_monster' | 'impulse_demon' | 'scam_spirit';
  power: number;
  icon: string;
  taunt: string;
}

// Helper types for UI components
export type CharacterOutfit = string; 
export type CharacterAccessory = string;

// CustomizationItem (For the Shop UI internal logic if needed, 
// though we mostly use GameItem now)
export interface CustomizationItem {
  id: string;
  name: string;
  type: 'outfit' | 'house' | 'accessory'; // 'house' is legacy
  value: string;
  cost: number;
  icon: string;
  description: string;
  unlocked: boolean;
}