import { getGoogleClient } from "@/lib/googleClient";
import { generators } from "openid-client";
import { cookies } from "next/headers";

export async function GET() {
  try {
    const client = await getGoogleClient();
    
    const code_verifier = generators.codeVerifier();
    const code_challenge = generators.codeChallenge(code_verifier);
    
    // Store code_verifier in cookie for later use
    const cookieStore = await cookies();
    cookieStore.set("code_verifier", code_verifier, { 
      httpOnly: true, 
      secure: process.env.NODE_ENV === "production",
      maxAge: 600 // 10 minutes
    });
    
    const authUrl = client.authorizationUrl({
      scope: "openid email profile https://www.googleapis.com/auth/calendar.events https://www.googleapis.com/auth/gmail.modify",
      code_challenge,
      code_challenge_method: "S256",
    });

    return Response.redirect(authUrl);
  } catch (error) {
    console.error("Google auth error:", error);
    return Response.json({ error: "Failed to initiate Google authentication" }, { status: 500 });
  }
}
