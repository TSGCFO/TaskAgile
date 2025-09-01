import OpenAI from "openai";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const vectorStoreId = searchParams.get("vectorStoreId");
    
    if (!vectorStoreId) {
      return Response.json({ error: "Vector store ID is required" }, { status: 400 });
    }

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const files = await openai.beta.vectorStores.files.list(vectorStoreId);

    return Response.json({
      files: files.data.map(file => ({
        id: file.id,
        file_id: file.file_id,
        status: file.status,
        created_at: file.created_at,
      })),
    });
  } catch (error) {
    console.error("List files error:", error);
    return Response.json(
      { error: "Failed to list files" }, 
      { status: 500 }
    );
  }
}
