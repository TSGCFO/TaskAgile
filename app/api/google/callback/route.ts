import { getGoogleClient } from "@/lib/googleClient";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get("code");
    const error = searchParams.get("error");
    
    if (error) {
      return Response.redirect("/?error=google_auth_failed");
    }
    
    if (!code) {
      return Response.redirect("/?error=missing_code");
    }

    const cookieStore = cookies();
    const code_verifier = cookieStore.get("code_verifier")?.value;
    
    if (!code_verifier) {
      return Response.redirect("/?error=missing_verifier");
    }

    const client = await getGoogleClient();
    
    const tokenSet = await client.callback(
      process.env.GOOGLE_REDIRECT_URI || "http://localhost:3000/api/google/callback",
      { code },
      { code_verifier }
    );

    // Store tokens in cookies
    const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
    
    cookieStore.set("gc_access_token", tokenSet.access_token!, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      expires,
    });
    
    if (tokenSet.refresh_token) {
      cookieStore.set("gc_refresh_token", tokenSet.refresh_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production", 
        expires,
      });
    }
    
    if (tokenSet.expires_at) {
      cookieStore.set("gc_expires_at", tokenSet.expires_at.toString(), {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        expires,
      });
    }

    // Clear code_verifier
    cookieStore.delete("code_verifier");

    return Response.redirect("/?connected=1");
  } catch (error) {
    console.error("Google callback error:", error);
    return Response.redirect("/?error=callback_failed");
  }
}
