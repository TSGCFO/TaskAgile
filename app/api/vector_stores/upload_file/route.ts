import OpenAI from "openai";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const vectorStoreId = formData.get("vectorStoreId") as string;
    
    if (!file || !vectorStoreId) {
      return Response.json({ error: "File and vector store ID are required" }, { status: 400 });
    }

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    // Upload file to OpenAI
    const uploadedFile = await openai.files.create({
      file: file,
      purpose: "assistants",
    });

    // Add file to vector store
    const vectorStoreFile = await openai.beta.vectorStores.files.create(
      vectorStoreId,
      {
        file_id: uploadedFile.id,
      }
    );

    return Response.json({
      id: vectorStoreFile.id,
      file_id: uploadedFile.id,
      filename: file.name,
      size: file.size,
      status: vectorStoreFile.status,
    });
  } catch (error) {
    console.error("File upload error:", error);
    return Response.json(
      { error: "Failed to upload file" }, 
      { status: 500 }
    );
  }
}
