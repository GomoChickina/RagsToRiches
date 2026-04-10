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

const parseAuthPayload = (raw: string): AuthResult | null => {
  try {
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === "object" && "token" in parsed && "user" in parsed) {
      return parsed as AuthResult;
    }
    return null;
  } catch {
    return null;
  }
};


// ── API ───────────────────────────────────────────────────────────────────────

export const api = {

  // ── AUTH ──────────────────────────────────────────────────────────────────

  register: async (name: string, email: string, password: string): Promise<AuthResult> => {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });
    const raw = await response.text();
    const authPayload = parseAuthPayload(raw);
    if (authPayload) return authPayload;
    if (!response.ok) throw new Error(raw || "Registration failed.");
    throw new Error("Registration failed: invalid server response.");
  },

  login: async (email: string, password: string): Promise<AuthResult> => {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const raw = await response.text();
    const authPayload = parseAuthPayload(raw);
    if (authPayload) return authPayload;
    if (!response.ok) throw new Error(raw || "Login failed.");
    throw new Error("Login failed: invalid server response.");
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
      const safeUserId = String(userId ?? "")
        .trim()
        .replace(/^"+|"+$/g, "");

      const response = await fetch(`${API_URL}/choose`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: safeUserId, situationId, choiceIndex }),
      });

      const raw = await response.text();
      let parsed: BackendUser | null = null;
      try {
        parsed = raw ? JSON.parse(raw) : null;
      } catch {
        parsed = null;
      }

      // Some environments can return a non-2xx status even when body is usable JSON.
      // If a valid user payload exists, use it to avoid blocking gameplay.
      if (parsed && typeof parsed === "object" && "id" in parsed && "stats" in parsed) {
        return parsed;
      }

      if (!response.ok) {
        throw new Error(raw || `Choice processing failed (${response.status})`);
      }

      return parsed;
    } catch (error) {
      console.error("❌ API Error:", error);
      return null;
    }
  },

 getShopCatalog: async (): Promise<GameItem[]> => {
    try {
      const response = await fetch(`${API_URL}/shop/catalog`);
      
      // Parse the JSON regardless of the status code
      const data = await response.json();
      
      // If the backend sent us our array of items, just use it and ignore the 400
      if (Array.isArray(data)) {
        return data;
      }

      // If it's not an array, THEN throw the error
      if (!response.ok) throw new Error(`Failed to fetch catalog: ${response.status}`);
      
      return data;
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