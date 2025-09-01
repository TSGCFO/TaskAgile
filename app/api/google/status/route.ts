import { getGoogleTokens } from "@/lib/googleTokens";

export async function GET() {
  try {
    const tokens = await getGoogleTokens();
    
    return Response.json({
      connected: !!tokens?.access_token,
    });
  } catch (error) {
    console.error("Google status error:", error);
    return Response.json({ connected: false });
  }
}
