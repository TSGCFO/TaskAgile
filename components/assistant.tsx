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
    <div className="h-full w-full relative overflow-hidden">
      {/* Animated background with multiple layers */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/5">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 20% 80%, hsl(var(--primary) / 0.15) 0%, transparent 50%),
                          radial-gradient(circle at 80% 20%, hsl(var(--accent) / 0.15) 0%, transparent 50%),
                          radial-gradient(circle at 40% 40%, hsl(var(--primary) / 0.1) 0%, transparent 50%)`
        }} />
        {/* Floating particles */}
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="particle"
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${i * 3}s`,
              width: `${Math.random() * 4 + 2}px`,
              height: `${Math.random() * 4 + 2}px`,
              background: `hsl(var(--primary) / ${Math.random() * 0.5 + 0.3})`,
              borderRadius: '50%',
            }}
          />
        ))}
      </div>
      
      {/* Content */}
      <div className="relative z-10 h-full p-6">
        <div className="flex justify-between items-center mb-8 px-10">
          <div className="group">
            <h1 className="text-5xl font-black gradient-text mb-2 hover:scale-105 transition-transform duration-300 cursor-default">
              AI Assistant
            </h1>
            <p className="text-sm text-muted-foreground opacity-80 group-hover:opacity-100 transition-opacity duration-300">
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
