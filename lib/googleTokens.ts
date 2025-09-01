import { cookies } from "next/headers";

export interface GoogleTokens {
  access_token: string;
  refresh_token?: string;
  expires_at?: number;
}

export async function getGoogleTokens(): Promise<GoogleTokens | null> {
  const cookieStore = await cookies();
  
  const accessToken = cookieStore.get("gc_access_token")?.value;
  const refreshToken = cookieStore.get("gc_refresh_token")?.value;
  const expiresAt = cookieStore.get("gc_expires_at")?.value;
  
  if (!accessToken) {
    return null;
  }

  return {
    access_token: accessToken,
    refresh_token: refreshToken,
    expires_at: expiresAt ? parseInt(expiresAt) : undefined,
  };
}

export async function refreshGoogleTokens(refreshToken: string): Promise<GoogleTokens | null> {
  try {
    const response = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id: process.env.GOOGLE_CLIENT_ID!,
        client_secret: process.env.GOOGLE_CLIENT_SECRET!,
        refresh_token: refreshToken,
        grant_type: "refresh_token",
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to refresh token");
    }

    const tokens = await response.json();
    return {
      access_token: tokens.access_token,
      refresh_token: tokens.refresh_token || refreshToken,
      expires_at: Date.now() + (tokens.expires_in * 1000),
    };
  } catch (error) {
    console.error("Error refreshing Google tokens:", error);
    return null;
  }
}
