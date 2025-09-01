import { create } from "zustand";
import { INITIAL_MESSAGE } from "@/config/constants";

interface ConversationState {
  chatMessages: any[];
  conversationItems: any[];
  isAssistantLoading: boolean;
  setChatMessages: (items: any[]) => void;
  setConversationItems: (messages: any[]) => void;
  addChatMessage: (item: any) => void;
  updateLastAssistantMessage: (item: any) => void;
  addConversationItem: (message: any) => void;
  setAssistantLoading: (loading: boolean) => void;
  resetConversation: () => void;
}

const useConversationStore = create<ConversationState>((set) => ({
  chatMessages: [{ type: "message", role: "assistant", content: [{ type: "output_text", text: INITIAL_MESSAGE }] }],
  conversationItems: [],
  isAssistantLoading: false,
  setChatMessages: (items) => set({ chatMessages: items }),
  setConversationItems: (messages) => set({ conversationItems: messages }),
  addChatMessage: (item) => set((state) => ({ chatMessages: [...state.chatMessages, item] })),
  updateLastAssistantMessage: (item) => set((state) => {
    const messages = [...state.chatMessages];
    const lastIndex = messages.length - 1;
    
    // Only update if the last message is from the assistant
    if (lastIndex >= 0 && messages[lastIndex].role === 'assistant') {
      messages[lastIndex] = item;
    } else {
      // If not, add as new message
      messages.push(item);
    }
    
    return { chatMessages: messages };
  }),
  addConversationItem: (message) => set((state) => ({ conversationItems: [...state.conversationItems, message] })),
  setAssistantLoading: (loading) => set({ isAssistantLoading: loading }),
  resetConversation: () => set(() => ({
    chatMessages: [{ type: "message", role: "assistant", content: [{ type: "output_text", text: INITIAL_MESSAGE }] }],
    conversationItems: [],
  })),
}));

export default useConversationStore;
