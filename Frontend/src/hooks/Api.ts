import { API_URL, BackendUser, GameItem, SituationCard } from "@/types/game";

export interface AuthUser {
  id: string;
  email: string;
  name?: string;
}

export interface AuthResponse {
  token: string;
  user: BackendUser;
}

export interface MeResponse {
  id: string;
  email: string;
  createdAt?: string;
}

const AUTH_TOKEN_KEY = "rtr_token";

const parseJson = <T>(raw: string): T | null => {
  try {
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
};

const getAuthHeaders = (): HeadersInit => {
  const token = localStorage.getItem(AUTH_TOKEN_KEY);
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const authStorage = {
  tokenKey: AUTH_TOKEN_KEY,
  setToken: (token: string) => localStorage.setItem(AUTH_TOKEN_KEY, token),
  clearToken: () => localStorage.removeItem(AUTH_TOKEN_KEY),
};

export const api = {
  register: async (name: string, email: string, password: string): Promise<AuthResponse> => {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });

    const raw = await response.text();
    const parsed = parseJson<AuthResponse>(raw);
    if (response.ok && parsed) {
      return parsed;
    }
    throw new Error(raw || "Registration failed.");
  },

  login: async (email: string, password: string): Promise<AuthResponse> => {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const raw = await response.text();
    const parsed = parseJson<AuthResponse>(raw);
    if (response.ok && parsed) {
      return parsed;
    }
    throw new Error(raw || "Login failed.");
  },

  me: async (): Promise<MeResponse | null> => {
    const response = await fetch(`${API_URL}/me`, {
      headers: getAuthHeaders(),
    });
    if (!response.ok) {
      return null;
    }
    return response.json();
  },

  getProfile: async (userId: string): Promise<BackendUser | null> => {
    try {
      const response = await fetch(`${API_URL}/profile/${userId}`, {
        headers: getAuthHeaders(),
      });
      if (!response.ok) {
        return null;
      }
      return response.json();
    } catch (error) {
      console.error("Failed to load profile", error);
      return null;
    }
  },

  saveProfile: async (user: BackendUser): Promise<BackendUser | null> => {
    try {
      const response = await fetch(`${API_URL}/profile/save`, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...getAuthHeaders() },
        body: JSON.stringify(user),
      });
      if (!response.ok) {
        throw new Error(await response.text());
      }
      return response.json();
    } catch (error) {
      console.error("Failed to save profile", error);
      return null;
    }
  },

  getCards: async (): Promise<SituationCard[]> => {
    try {
      const response = await fetch(`${API_URL}/cards`, {
        headers: getAuthHeaders(),
      });
      if (!response.ok) {
        throw new Error("Failed to fetch cards");
      }
      return response.json();
    } catch (error) {
      console.error("Failed to fetch cards", error);
      return [];
    }
  },

  getLeaderboard: async (sortBy = "overall"): Promise<BackendUser[]> => {
    try {
      const response = await fetch(`${API_URL}/leaderboard?sortBy=${sortBy}`, {
        headers: getAuthHeaders(),
      });
      if (!response.ok) {
        throw new Error("Failed to fetch leaderboard");
      }
      return response.json();
    } catch (error) {
      console.error("Failed to fetch leaderboard", error);
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
        headers: { "Content-Type": "application/json", ...getAuthHeaders() },
        body: JSON.stringify({ userId, situationId, choiceIndex }),
      });

      const raw = await response.text();
      const parsed = parseJson<BackendUser>(raw);
      if (parsed) {
        return parsed;
      }
      if (!response.ok) {
        throw new Error(raw || `Choice processing failed (${response.status})`);
      }
      return null;
    } catch (error) {
      console.error("Choice processing failed", error);
      return null;
    }
  },

  getShopCatalog: async (): Promise<GameItem[]> => {
    try {
      const response = await fetch(`${API_URL}/shop/catalog`, {
        headers: getAuthHeaders(),
      });
      const data = await response.json();
      return Array.isArray(data) ? data : [];
    } catch (error) {
      console.error("Shop catalog failed", error);
      return [];
    }
  },

  buyItem: async (userId: string | null, itemId: string): Promise<BackendUser | null> => {
    if (!userId) {
      throw new Error("User not logged in");
    }
    try {
      const response = await fetch(`${API_URL}/shop/buy`, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...getAuthHeaders() },
        body: JSON.stringify({ userId, itemId }),
      });
      if (!response.ok) {
        throw new Error(await response.text());
      }
      return await response.json();
    } catch (error) {
      console.error("Failed to buy item", error);
      return null;
    }
  },

  equipItem: async (userId: string | null, itemId: string): Promise<BackendUser | null> => {
    if (!userId) {
      throw new Error("User not logged in");
    }
    try {
      const response = await fetch(`${API_URL}/shop/equip`, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...getAuthHeaders() },
        body: JSON.stringify({ userId, itemId }),
      });
      if (!response.ok) {
        throw new Error(await response.text());
      }
      return response.json();
    } catch (error) {
      console.error("Failed to equip item", error);
      return null;
    }
  },
};
