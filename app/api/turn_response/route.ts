import { getDeveloperPrompt, MODEL } from "@/config/constants";
import { NextResponse } from "next/server";
import OpenAI from "openai";

export async function POST(request: Request) {
  try {
    const { messages, tools } = await request.json();
    
    // Log tools to debug
    // Remove debug logging
    // console.log("Received tools:", JSON.stringify(tools, null, 2));
    
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

    // Filter and fix tools format
    const fixedTools = tools.map((tool: any) => {
      // Code interpreter needs specific format
      if (tool.type === "code_interpreter") {
        return {
          type: "code_interpreter",
          container: {
            type: "auto"
          }
        };
      }
      // Function tools need name at root level
      if (tool.type === "function" && tool.function) {
        return {
          type: "function",
          name: tool.function.name,
          function: {
            description: tool.function.description,
            parameters: tool.function.parameters
          }
        };
      }
      return tool;
    });

    // console.log("Fixed tools:", JSON.stringify(fixedTools, null, 2));

    const events = await openai.responses.create({
      model: MODEL,
      input: formattedInput,
      text: {
        format: { type: "text" },
        verbosity: "medium"
      },
      tools: fixedTools,
      stream: true,
      store: false,
    });

    const stream = new ReadableStream({
      async start(controller) {
        let closed = false;
        
        try {
          for await (const event of events) {
            // Check if controller is still open before enqueuing
            if (closed) break;
            
            try {
              const data = JSON.stringify({ event: event.type, data: event });
              controller.enqueue(`data: ${data}\n\n`);
            } catch (error) {
              // Controller might have been closed by the client
              if (error instanceof TypeError && error.message.includes('Controller is already closed')) {
                closed = true;
                break;
              }
              throw error;
            }
          }
          
          // Only close if not already closed
          if (!closed) {
            controller.close();
          }
        } catch (error) {
          console.error("Error in streaming loop:", error);
          if (!closed) {
            controller.error(error);
          }
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
