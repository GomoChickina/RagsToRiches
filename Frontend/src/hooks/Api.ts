import {
  API_URL,
  BackendUser,
  SituationCard,
  GameItem
} from "@/types/game";

// ── AUTH TYPES ────────────────────────────────────────────────────────────────

export interface AuthResult {
  token: string;
  user: BackendUser;
}

// ── API ───────────────────────────────────────────────────────────────────────

export const api = {

  // ── AUTH ──────────────────────────────────────────────────────────────────

  register: async (name: string, email: string, password: string): Promise<AuthResult> => {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });

    if (!response.ok) {
      const msg = await response.text();
      throw new Error(msg || "Registration failed.");
    }

    return response.json();
  },

  login: async (email: string, password: string): Promise<AuthResult> => {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const msg = await response.text();
      throw new Error(msg || "Login failed.");
    }

    return response.json();
  },

  // ── GAME ──────────────────────────────────────────────────────────────────

  getProfile: async (userId: string): Promise<BackendUser | null> => {
    try {
      const response = await fetch(`${API_URL}/profile/${userId}`);
      if (!response.ok) {
        if (response.status === 404) console.warn("User not found.");
        return null;
      }
      return response.json();
    } catch (error) {
      console.error("❌ API Error: Failed to load profile", error);
      return null;
    }
  },

  saveProfile: async (user: BackendUser): Promise<BackendUser | null> => {
    try {
      const response = await fetch(`${API_URL}/profile/save`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(user),
      });
      if (!response.ok) throw new Error("Save failed");
      return response.json();
    } catch (error) {
      console.error("❌ API Error: Failed to save profile", error);
      return null;
    }
  },

  getCards: async (): Promise<SituationCard[]> => {
    try {
      const response = await fetch(`${API_URL}/cards`);
      if (!response.ok) throw new Error("Failed to fetch cards");
      return response.json();
    } catch (error) {
      console.error("❌ API Error: Failed to fetch cards", error);
      return [];
    }
  },

  getLeaderboard: async (sortBy: string = "overall"): Promise<BackendUser[]> => {
    try {
      const response = await fetch(`${API_URL}/leaderboard?sortBy=${sortBy}`);
      if (!response.ok) throw new Error("Failed to fetch leaderboard");
      return response.json();
    } catch (error) {
      console.error("❌ API Error: Failed to fetch leaderboard", error);
      return [];
    }
  },

  makeChoice: async (
    userId: string,
    situationId: number,
    choiceIndex: number
  ): Promise<BackendUser | null> => {
    try {
      const response = await fetch(`${API_URL}/choose`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, situationId, choiceIndex }),
      });
      if (!response.ok) throw new Error("Choice processing failed");
      return response.json();
    } catch (error) {
      console.error("❌ API Error:", error);
      return null;
    }
  },

  getShopCatalog: async (): Promise<GameItem[]> => {
    try {
      const response = await fetch(`${API_URL}/shop/catalog`);
      if (!response.ok) throw new Error("Failed to fetch catalog");
      return response.json();
    } catch (error) {
      console.error("❌ API Error: Shop catalog failed", error);
      return [];
    }
  },

  buyItem: async (userId: string, itemId: string): Promise<BackendUser | null> => {
    const response = await fetch(`${API_URL}/shop/buy`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, itemId }),
    });
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText);
    }
    return response.json();
  },

  equipItem: async (userId: string, itemId: string): Promise<BackendUser | null> => {
    try {
      const response = await fetch(`${API_URL}/shop/equip`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, itemId }),
      });
      if (!response.ok) throw new Error("Equip failed");
      return response.json();
    } catch (error) {
      console.error("❌ API Error: Equip failed", error);
      return null;
    }
  },
};