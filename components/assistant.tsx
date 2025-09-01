"use client";
import React, { useEffect, useRef } from "react";
import Chat from "./chat";
import useConversationStore from "@/stores/useConversationStore";
import { Item, processMessages } from "@/lib/assistant";
import { ConversationHistory } from "./conversation-history";

export default function Assistant() {
  const {
    chatMessages,
    addConversationItem,
    addChatMessage,
    setAssistantLoading,
    saveConversation,
    currentConversationId,
  } = useConversationStore();

  const lastSaveTime = useRef<number>(Date.now());
  const messageCount = useRef<number>(chatMessages.length);

  // Auto-save functionality
  useEffect(() => {
    const currentMessageCount = chatMessages.length;

    // Auto-save every 5 messages or every 5 minutes
    if (currentConversationId && currentMessageCount > messageCount.current) {
      const timeSinceLastSave = Date.now() - lastSaveTime.current;
      const messagesSinceLastSave = currentMessageCount - messageCount.current;

      if (messagesSinceLastSave >= 5 || timeSinceLastSave > 5 * 60 * 1000) {
        saveConversation();
        lastSaveTime.current = Date.now();
        messageCount.current = currentMessageCount;
      }
    }
  }, [chatMessages, currentConversationId, saveConversation]);

  const handleSendMessage = async (message: string) => {
    if (!message.trim()) return;

    const userItem: Item = {
      type: "message",
      role: "user",
      content: [{ type: "input_text", text: message.trim() }],
    };
    const userMessage: any = {
      role: "user",
      content: message.trim(),
    };

    try {
      setAssistantLoading(true);
      addConversationItem(userMessage);
      addChatMessage(userItem);
      await processMessages();
    } catch (error) {
      console.error("Error processing message:", error);
    }
  };

  const handleApprovalResponse = async (approve: boolean, id: string) => {
    const approvalItem = {
      type: "mcp_approval_response",
      approve,
      approval_request_id: id,
    } as any;
    try {
      addConversationItem(approvalItem);
      await processMessages();
    } catch (error) {
      console.error("Error sending approval response:", error);
    }
  };

  return (
    <div className="h-full w-full bg-background">
      <div className="h-full max-w-7xl mx-auto px-4 py-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-semibold text-foreground">
              AI Assistant
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Powered by OpenAI Responses API
            </p>
          </div>
          <ConversationHistory />
        </div>
        <Chat
          items={chatMessages}
          onSendMessage={handleSendMessage}
          onApprovalResponse={handleApprovalResponse}
        />
      </div>
    </div>
  );
}
