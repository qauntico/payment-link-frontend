"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { User, login as loginApi, signup as signupApi, getUserProfile, SignupRequest } from "@/lib/api/auth";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<User>;
  signup: (data: SignupRequest) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load user on mount by fetching from API
  useEffect(() => {
    const loadUser = async () => {
      try {
        const token = localStorage.getItem("access_token");

        if (token) {
          // Fetch user profile from API
          const userData = await getUserProfile();
          setUser(userData);
        }
      } catch (error) {
        console.error("Error loading user:", error);
        // Clear invalid token
        localStorage.removeItem("access_token");
      } finally {
        setIsLoading(false);
      }
    };

    loadUser();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await loginApi({ email, password });

      // Store only token in localStorage
      localStorage.setItem("access_token", response.accessToken);

      // Set http-only cookie via API endpoint
      await fetch("/api/auth/set-cookie", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token: response.accessToken }),
      });

      // Set user in state (fetched from response)
      setUser(response.user);
      return response.user;
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  };

  const signup = async (data: SignupRequest) => {
    try {
      const response = await signupApi(data);

      // Store only token in localStorage
      localStorage.setItem("access_token", response.accessToken);

      // Set http-only cookie via API endpoint
      await fetch("/api/auth/set-cookie", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token: response.accessToken }),
      });

      // Set user in state (fetched from response)
      setUser(response.user);
    } catch (error) {
      console.error("Signup error:", error);
      throw error;
    }
  };

  const logout = async () => {
    // Clear token from localStorage
    localStorage.removeItem("access_token");

    // Clear http-only cookie via API endpoint
    try {
      await fetch("/api/auth/clear-cookie", {
        method: "POST",
      });
    } catch (error) {
      console.error("Error clearing cookie:", error);
    }

    // Clear user from state
    setUser(null);
  };

  const refreshUser = async () => {
    try {
      const token = localStorage.getItem("access_token");
      if (!token) {
        setUser(null);
        return;
      }

      // Fetch fresh user data from API
      const userData = await getUserProfile();
      setUser(userData);
    } catch (error) {
      console.error("Error refreshing user:", error);
      // If refresh fails, clear everything
      await logout();
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        signup,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
