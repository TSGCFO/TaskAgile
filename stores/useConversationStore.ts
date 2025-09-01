import { create } from "zustand";
import { INITIAL_MESSAGE } from "@/config/constants";

interface ConversationState {
  chatMessages: any[];
  conversationItems: any[];
  isAssistantLoading: boolean;
  setChatMessages: (items: any[]) => void;
  setConversationItems: (messages: any[]) => void;
  addChatMessage: (item: any) => void;
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
  addConversationItem: (message) => set((state) => ({ conversationItems: [...state.conversationItems, message] })),
  setAssistantLoading: (loading) => set({ isAssistantLoading: loading }),
  resetConversation: () => set(() => ({
    chatMessages: [{ type: "message", role: "assistant", content: [{ type: "output_text", text: INITIAL_MESSAGE }] }],
    conversationItems: [],
  })),
}));

export default useConversationStore;
