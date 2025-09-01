import { getDeveloperPrompt, MODEL } from "@/config/constants";
import { NextResponse } from "next/server";
import OpenAI from "openai";

export async function POST(request: Request) {
  try {
    const { messages, tools } = await request.json();
    
    // Convert messages to Responses API format
    const formattedInput = messages.map((msg: any) => ({
      role: msg.role === "assistant" ? "assistant" : msg.role === "tool" ? "tool" : msg.role,
      content: msg.content
    }));
    
    // Add developer instructions as the first message
    formattedInput.unshift({
      role: "developer",
      content: [
        {
          type: "input_text",
          text: getDeveloperPrompt()
        }
      ]
    });
    
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const events = await openai.responses.create({
      model: MODEL,
      input: formattedInput,
      text: {
        format: { type: "text" },
        verbosity: "medium"
      },
      tools: tools as any,
      stream: true,
      store: false,
    });

    const stream = new ReadableStream({
      async start(controller) {
        try {
          for await (const event of events) {
            const data = JSON.stringify({ event: event.type, data: event });
            controller.enqueue(`data: ${data}\n\n`);
          }
          controller.close();
        } catch (error) {
          console.error("Error in streaming loop:", error);
          controller.error(error);
        }
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        "Connection": "keep-alive",
      },
    });
  } catch (error) {
    console.error("Error in POST handler:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" }, 
      { status: 500 }
    );
  }
}
