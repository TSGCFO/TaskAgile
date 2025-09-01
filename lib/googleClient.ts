import { Issuer, Client } from "openid-client";

let googleClient: Client | null = null;

export async function getGoogleClient(): Promise<Client> {
  if (!googleClient) {
    const googleIssuer = await Issuer.discover("https://accounts.google.com");
    
    googleClient = new googleIssuer.Client({
      client_id: process.env.GOOGLE_CLIENT_ID!,
      client_secret: process.env.GOOGLE_CLIENT_SECRET!,
      redirect_uris: [process.env.GOOGLE_REDIRECT_URI || "http://localhost:3000/api/google/callback"],
      response_types: ["code"],
    });
  }
  
  return googleClient;
}
