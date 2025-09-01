import { functionsMap } from "@/config/functions";
import useConversationStore from "@/stores/useConversationStore";
import { getTools } from "@/lib/tools/tools";

let controller: AbortController | null = null;

export async function processMessages(message: string) {
  const { 
    addChatMessage, 
    addConversationItem, 
    setAssistantLoading, 
    conversationItems 
  } = useConversationStore.getState();

  // Add user message
  const userMessage = { 
    type: "message", 
    role: "user", 
    content: [{ type: "input_text", text: message }] 
  };
  
  addChatMessage(userMessage);
  addConversationItem(userMessage);

  setAssistantLoading(true);

  try {
    const tools = await getTools();
    const response = await fetch("/api/turn_response", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        messages: [...conversationItems, userMessage],
        tools,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    await handleTurn(response);
  } catch (error) {
    console.error("Error processing messages:", error);
    addChatMessage({
      type: "message",
      role: "assistant", 
      content: [{ type: "output_text", text: "Sorry, I encountered an error. Please try again." }]
    });
  } finally {
    setAssistantLoading(false);
  }
}

async function handleTurn(response: Response) {
  const { addChatMessage, addConversationItem } = useConversationStore.getState();
  
  controller = new AbortController();
  const reader = response.body?.getReader();
  
  if (!reader) {
    throw new Error("No response body reader available");
  }

  const decoder = new TextDecoder();
  let currentMessage: any = null;
  let currentToolCalls: any[] = [];
  let messageCreated = false;

  try {
    while (true) {
      const { done, value } = await reader.read();
      
      if (done) break;
      
      const chunk = decoder.decode(value);
      const lines = chunk.split('\n').filter(line => line.trim() !== '');
      
      for (const line of lines) {
        if (line.startsWith('data: ')) {
          try {
            const eventData = JSON.parse(line.slice(6));
            const result = await handleEvent(eventData, currentMessage, currentToolCalls, messageCreated);
            if (result) {
              currentMessage = result.message;
              messageCreated = result.messageCreated || messageCreated;
            }
          } catch (error) {
            console.error("Error parsing SSE data:", error);
          }
        }
      }
    }
  } finally {
    reader.releaseLock();
    controller = null;
  }
}

async function handleEvent(eventData: any, currentMessage: any, currentToolCalls: any[], messageCreated: boolean) {
  const { addChatMessage, addConversationItem } = useConversationStore.getState();
  
  switch (eventData.event) {
    case 'response.created':
      // Response started, but don't create message yet
      return null;

    case 'response.output_item.added':
      // Only create message for actual message items, not reasoning
      if (eventData.data.item?.type === 'message' && !messageCreated) {
        currentMessage = {
          type: "message",
          role: "assistant",
          content: []
        };
        addChatMessage(currentMessage);
        return { message: currentMessage, messageCreated: true };
      }
      // Ignore reasoning items
      return { message: currentMessage, messageCreated };

    case 'response.content_part.added':
      // Only add content part if we have a message (not for reasoning)
      if (currentMessage && eventData.data.item_id && eventData.data.output_index > 0) {
        // Don't add another text part, it will be added when text starts streaming
        return { message: currentMessage, messageCreated };
      }
      return { message: currentMessage, messageCreated };

    case 'response.output_text.delta':
      // Only process text deltas for actual messages (output_index > 0 means it's not reasoning)
      if (currentMessage && eventData.data.output_index > 0 && eventData.data.delta) {
        if (currentMessage.content.length === 0) {
          currentMessage.content.push({ type: "output_text", text: "" });
        }
        const lastContent = currentMessage.content[currentMessage.content.length - 1];
        if (lastContent?.type === 'output_text') {
          lastContent.text += eventData.data.delta;
          addChatMessage({ ...currentMessage });
        }
      }
      return { message: currentMessage, messageCreated };

    case 'response.function_call_delta':
      // Handle function call streaming
      const callId = eventData.data.id;
      let toolCall = currentToolCalls.find(tc => tc.id === callId);
      
      if (!toolCall) {
        toolCall = {
          id: callId,
          type: 'function',
          function: { name: '', arguments: '' }
        };
        currentToolCalls.push(toolCall);
        
        // Add tool call progress indicator
        addChatMessage({
          type: "tool_call_progress",
          id: callId,
          name: eventData.data.name || '',
          status: "executing",
          progress: 0
        });
      }

      if (eventData.data.name) {
        toolCall.function.name = eventData.data.name;
      }
      if (eventData.data.arguments) {
        toolCall.function.arguments += eventData.data.arguments;
      }
      return { message: currentMessage, messageCreated };

    case 'response.function_call_done':
      // Execute the function call
      const completedCall = currentToolCalls.find(tc => tc.id === eventData.data.id);
      if (completedCall) {
        await executeFunctionCall(completedCall);
      }
      return { message: currentMessage, messageCreated };

    case 'response.done':
    case 'response.output_item.done':
      if (currentMessage && eventData.data?.item?.type === 'message') {
        addConversationItem(currentMessage);
      }
      return { message: currentMessage, messageCreated };

    default:
      return { message: currentMessage, messageCreated };
  }
}

async function executeFunctionCall(toolCall: any) {
  const { addChatMessage } = useConversationStore.getState();
  
  try {
    // Update progress to show execution
    addChatMessage({
      type: "tool_call_progress",
      id: toolCall.id,
      name: toolCall.function.name,
      status: "executing", 
      progress: 50
    });

    const functionName = toolCall.function.name;
    const functionArgs = JSON.parse(toolCall.function.arguments);
    
    if (functionsMap[functionName as keyof typeof functionsMap]) {
      const result = await functionsMap[functionName as keyof typeof functionsMap](functionArgs);
      
      // Update progress to show completion
      addChatMessage({
        type: "tool_call_progress",
        id: toolCall.id,
        name: toolCall.function.name,
        status: "completed",
        progress: 100,
        result: result
      });

      // Add tool result to conversation
      const toolResultMessage = {
        type: "message",
        role: "tool",
        tool_call_id: toolCall.id,
        content: [{ type: "tool_result", result: JSON.stringify(result) }]
      };
      
      useConversationStore.getState().addConversationItem(toolResultMessage);
      
      // Continue conversation with tool result
      await processToolResult();
    }
  } catch (error) {
    console.error("Error executing function call:", error);
    addChatMessage({
      type: "tool_call_progress",
      id: toolCall.id,
      name: toolCall.function.name,
      status: "error",
      progress: 0,
      error: error instanceof Error ? error.message : "Unknown error"
    });
  }
}

async function processToolResult() {
  const { conversationItems, setAssistantLoading } = useConversationStore.getState();
  
  setAssistantLoading(true);
  
  try {
    const tools = await getTools();
    const response = await fetch("/api/turn_response", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        messages: conversationItems,
        tools,
      }),
    });

    if (response.ok) {
      await handleTurn(response);
    }
  } catch (error) {
    console.error("Error processing tool result:", error);
  } finally {
    setAssistantLoading(false);
  }
}

export function stopGeneration() {
  if (controller) {
    controller.abort();
    controller = null;
    useConversationStore.getState().setAssistantLoading(false);
  }
}
