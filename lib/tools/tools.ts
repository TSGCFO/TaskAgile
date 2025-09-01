import useToolsStore from "@/stores/useToolsStore";
import { toolsList } from "@/config/tools-list";
import { getGoogleConnectors } from "./connectors";

export async function getTools() {
  const toolsState = useToolsStore.getState();
  const tools: any[] = [];

  // Built-in tools - OpenAI Responses API format
  if (toolsState.webSearch) {
    // Web search with configuration
    tools.push({
      type: "web_search",
      filters: null,
      search_context_size: "medium",
      user_location: {
        type: "approximate",
        city: null,
        country: null,
        region: null,
        timezone: null
      }
    });
  }

  if (toolsState.fileSearch && toolsState.currentVectorStore.id) {
    // File search with vector store
    tools.push({
      type: "file_search",
      vector_store_ids: [toolsState.currentVectorStore.id]
    });
  }

  if (toolsState.codeInterpreter) {
    // Code interpreter
    tools.push({ 
      type: "code_interpreter"
    });
  }

  // Custom function tools
  if (toolsState.functions) {
    const enabledFunctions = [];
    
    if (toolsState.weather) {
      enabledFunctions.push(toolsList.find(t => t.name === "get_weather"));
    }
    
    if (toolsState.jokes) {
      enabledFunctions.push(toolsList.find(t => t.name === "get_joke"));
    }

    enabledFunctions.forEach(func => {
      if (func) {
        tools.push({
          type: "function",
          function: {
            name: func.name,
            description: func.description,
            parameters: {
              type: "object",
              properties: func.parameters,
              required: Object.keys(func.parameters)
            }
          }
        });
      }
    });
  }

  // Google connectors
  if (toolsState.googleCalendar || toolsState.googleGmail) {
    const googleConnectors = await getGoogleConnectors();
    tools.push(...googleConnectors);
  }

  return tools;
}
