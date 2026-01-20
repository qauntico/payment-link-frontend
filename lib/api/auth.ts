import api from './client';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  businessName: string;
  supportEmail: string | null;
  role: string;
  createdAt: string;
  updatedAt: string;
}

export interface LoginResponse {
  user: User;
  accessToken: string;
}

export interface SignupRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  businessName: string;
  supportEmail?: string;
}

export interface SignupResponse {
  user: User;
  accessToken: string;
}

const getBackendUrl = () => {
 
  // For client-side API calls, we need NEXT_PUBLIC_BACKEND_URL
  if (typeof window !== "undefined") {
    return process.env.NEXT_PUBLIC_BACKEND_URL || "";
  }
  // Server-side can use both, but prefer NEXT_PUBLIC for consistency
  return process.env.NEXT_PUBLIC_BACKEND_URL || process.env.BACKEND_URL || "";
};

// Login uses fetch directly 
export const login = async (
  credentials: LoginRequest
): Promise<LoginResponse> => {
  const backendUrl = getBackendUrl();
  
  if (!backendUrl) {
    throw new Error("BACKEND_URL is not configured");
  }

  const response = await fetch(`${backendUrl}/users/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(credentials),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({
      message: "Login failed",
    }));
    throw new Error(error.message || "Login failed");
  }

  return response.json();
};

// Signup uses fetch directly 
export const signup = async (
  data: SignupRequest
): Promise<SignupResponse> => {
  const backendUrl = getBackendUrl();
  
  if (!backendUrl) {
    throw new Error("BACKEND_URL is not configured");
  }

  const response = await fetch(`${backendUrl}/users/signup`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({
      message: "Signup failed",
    }));
    throw new Error(error.message || "Signup failed");
  }

  return response.json();
};


export const getUserProfile = async (): Promise<User> => {
  const response = await api.get<User>('/users/profile');
  return response.data;
};

export interface UpdateUserProfileRequest {
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  businessName?: string;
  supportEmail?: string | null;
}

export const updateUserProfile = async (
  data: UpdateUserProfileRequest
): Promise<User> => {
  const response = await api.patch<User>('/users/profile', data);
  return response.data;
};
