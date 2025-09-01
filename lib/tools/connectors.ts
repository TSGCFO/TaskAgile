export async function getGoogleConnectors() {
  const connectors = [];
  
  try {
    const statusResponse = await fetch("/api/google/status");
    const { connected } = await statusResponse.json();
    
    if (!connected) {
      return connectors;
    }

    // Add Google Calendar MCP connector
    connectors.push({
      type: "mcp",
      server_label: "google_calendar",
      server_url: "google_calendar",
      require_approval: "never",
      allowed_tools: ["*"]
    });

    // Add Gmail MCP connector  
    connectors.push({
      type: "mcp",
      server_label: "gmail",
      server_url: "gmail",
      require_approval: "never",
      allowed_tools: ["*"]
    });
  } catch (error) {
    console.error("Error getting Google connectors:", error);
  }

  return connectors;
}
