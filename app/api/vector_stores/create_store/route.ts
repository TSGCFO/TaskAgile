import OpenAI from "openai";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { name } = await request.json();
    
    if (!name) {
      return Response.json({ error: "Store name is required" }, { status: 400 });
    }

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const vectorStore = await openai.beta.vectorStores.create({
      name: name,
    });

    return Response.json({
      id: vectorStore.id,
      name: vectorStore.name,
      status: vectorStore.status,
      file_counts: vectorStore.file_counts,
    });
  } catch (error) {
    console.error("Vector store creation error:", error);
    return Response.json(
      { error: "Failed to create vector store" }, 
      { status: 500 }
    );
  }
}
