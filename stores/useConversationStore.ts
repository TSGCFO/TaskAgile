import { create } from "zustand";
import { Item } from "@/lib/assistant";
import { ChatCompletionMessageParam } from "openai/resources/chat/completions";
import { INITIAL_MESSAGE } from "@/config/constants";
import useToolsStore from "@/stores/useToolsStore";

interface ConversationState {
  // Items displayed in the chat
  chatMessages: Item[];
  // Items sent to the Responses API
  conversationItems: any[];
  // Whether we are waiting for the assistant response
  isAssistantLoading: boolean;
  // Current conversation ID for persistence
  currentConversationId: number | null;

  setChatMessages: (items: Item[]) => void;
  setConversationItems: (messages: any[]) => void;
  addChatMessage: (item: Item) => void;
  addConversationItem: (message: ChatCompletionMessageParam) => void;
  setAssistantLoading: (loading: boolean) => void;
  rawSet: (state: any) => void;
  resetConversation: () => void;
  setCurrentConversationId: (id: number | null) => void;
  saveConversation: (title?: string) => Promise<number>;
  loadConversation: (id: number) => Promise<void>;
}

const useConversationStore = create<ConversationState>((set) => ({
  chatMessages: [
    {
      type: "message",
      role: "assistant",
      content: [{ type: "output_text", text: INITIAL_MESSAGE }],
    },
  ],
  conversationItems: [],
  isAssistantLoading: false,
  currentConversationId: null,
  setChatMessages: (items) => set({ chatMessages: items }),
  setConversationItems: (messages) => set({ conversationItems: messages }),
  addChatMessage: (item) =>
    set((state) => ({ chatMessages: [...state.chatMessages, item] })),
  addConversationItem: (message) =>
    set((state) => ({
      conversationItems: [...state.conversationItems, message],
    })),
  setAssistantLoading: (loading) => set({ isAssistantLoading: loading }),
  rawSet: set,
  resetConversation: () =>
    set(() => ({
      chatMessages: [
        {
          type: "message",
          role: "assistant",
          content: [{ type: "output_text", text: INITIAL_MESSAGE }],
        },
      ],
      conversationItems: [],
      currentConversationId: null,
    })),
  setCurrentConversationId: (id) => set({ currentConversationId: id }),
  saveConversation: async (title) => {
    const state = useConversationStore.getState();
    const conversationTitle = title || `Conversation ${new Date().toLocaleDateString()}`;
    
    try {
      // Get current tools configuration
      const toolsState = useToolsStore.getState();
      const toolsMetadata = {
        fileSearchEnabled: toolsState.fileSearchEnabled,
        webSearchEnabled: toolsState.webSearchEnabled,
        functionsEnabled: toolsState.functionsEnabled,
        googleIntegrationEnabled: toolsState.googleIntegrationEnabled,
        codeInterpreterEnabled: toolsState.codeInterpreterEnabled,
        mcpEnabled: toolsState.mcpEnabled,
        vectorStoreId: toolsState.vectorStore?.id || null,
        model: 'gpt-4o',
        timestamp: new Date().toISOString()
      };
      
      // Create or update conversation
      const response = state.currentConversationId
        ? await fetch(`/api/conversations/${state.currentConversationId}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
              title: conversationTitle,
              metadata: toolsMetadata
            }),
          })
        : await fetch('/api/conversations', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
              title: conversationTitle,
              metadata: toolsMetadata
            }),
          });
      
      const conversation = await response.json();
      
      // Save messages if we have any (filter out non-message items)
      if (state.chatMessages.length > 0) {
        const messagesToSave = state.chatMessages
          .filter(msg => msg.type === 'message')
          .map(msg => ({
            role: msg.role,
            content: msg.content,
            metadata: {
              timestamp: new Date().toISOString(),
              type: msg.type,
              id: (msg as any).id || null,
              toolCalls: state.chatMessages
                .filter(item => item.type === 'tool_call' && 
                       (item as any).status === 'completed')
                .map((tc: any) => ({
                  id: tc.id,
                  name: tc.name,
                  tool_type: tc.tool_type,
                  output: tc.output
                }))
            }
          }));
        
        await fetch(`/api/conversations/${conversation.id}/messages`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(messagesToSave),
        });
      }
      
      set({ currentConversationId: conversation.id });
      return conversation.id;
    } catch (error) {
      console.error('Failed to save conversation:', error);
      throw error;
    }
  },
  loadConversation: async (id) => {
    try {
      const response = await fetch(`/api/conversations/${id}`);
      const data = await response.json();
      
      // Restore tools configuration if metadata exists
      if (data.metadata) {
        const toolsStore = useToolsStore.getState();
        if (data.metadata.fileSearchEnabled !== undefined) {
          toolsStore.setFileSearchEnabled(data.metadata.fileSearchEnabled);
        }
        if (data.metadata.webSearchEnabled !== undefined) {
          toolsStore.setWebSearchEnabled(data.metadata.webSearchEnabled);
        }
        if (data.metadata.functionsEnabled !== undefined) {
          toolsStore.setFunctionsEnabled(data.metadata.functionsEnabled);
        }
        if (data.metadata.googleIntegrationEnabled !== undefined) {
          toolsStore.setGoogleIntegrationEnabled(data.metadata.googleIntegrationEnabled);
        }
        if (data.metadata.codeInterpreterEnabled !== undefined) {
          toolsStore.setCodeInterpreterEnabled(data.metadata.codeInterpreterEnabled);
        }
        if (data.metadata.mcpEnabled !== undefined) {
          toolsStore.setMcpEnabled(data.metadata.mcpEnabled);
        }
      }
      
      // Convert saved messages to chat format
      const loadedMessages = data.messages.map((msg: any) => ({
        type: 'message',
        role: msg.role,
        content: msg.content,
        id: msg.metadata?.id || undefined,
      }));
      
      // Filter out reasoning and other non-essential items for conversationItems
      const filteredConversationItems = loadedMessages
        .filter((msg: any) => msg.role && msg.content)
        .map((msg: any) => ({
          role: msg.role,
          content: msg.content
        }));
      
      set({
        chatMessages: loadedMessages,
        conversationItems: filteredConversationItems,
        currentConversationId: id,
      });
    } catch (error) {
      console.error('Failed to load conversation:', error);
      throw error;
    }
  },
}));

export default useConversationStore;