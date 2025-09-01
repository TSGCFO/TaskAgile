export async function getGoogleConnectors() {
  const connectors = [];
  
  try {
    const statusResponse = await fetch("/api/google/status");
    const { connected } = await statusResponse.json();
    
    if (!connected) {
      return connectors;
    }

    // Add Google Calendar connector
    connectors.push({
      type: "connector",
      connector: {
        type: "google_calendar",
        name: "google_calendar",
        container: {
          type: "google_calendar",
          auth: {
            type: "oauth2"
          }
        }
      }
    });

    // Add Gmail connector  
    connectors.push({
      type: "connector",
      connector: {
        type: "gmail",
        name: "gmail",
        container: {
          type: "gmail",
          auth: {
            type: "oauth2"
          }
        }
      }
    });
  } catch (error) {
    console.error("Error getting Google connectors:", error);
  }

  return connectors;
}
