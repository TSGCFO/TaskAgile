import OpenAI from "openai";

const openai = new OpenAI();

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const vectorStoreId = searchParams.get("vector_store_id");
  
  // Return early if no vector store ID provided
  if (!vectorStoreId) {
    return new Response(JSON.stringify({ error: "No vector store ID provided" }), { 
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }
  
  try {
    const vectorStore = await openai.vectorStores.retrieve(vectorStoreId);
    return new Response(JSON.stringify(vectorStore), { 
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error: any) {
    // Handle 404 specifically - vector store doesn't exist
    if (error?.status === 404) {
      return new Response(JSON.stringify({ 
        error: "Vector store not found",
        vectorStoreId: vectorStoreId 
      }), { 
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // Log but don't expose internal errors
    console.error("Error fetching vector store:", error);
    return new Response(JSON.stringify({ 
      error: "Failed to fetch vector store" 
    }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}