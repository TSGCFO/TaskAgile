"use client";

import { useState, useEffect } from "react";
import useConversationStore from "@/stores/useConversationStore";
import ToolsPanel from "./tools-panel";
import ChatInput from "./chat-input";
import ToolCall from "./tool-call";
import { processMessages } from "@/lib/assistant";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import ReactMarkdown from "react-markdown";

export default function Assistant() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { chatMessages, isAssistantLoading, resetConversation } = useConversationStore();

  const handleSendMessage = async (message: string) => {
    await processMessages(message);
  };

  const renderMessage = (message: any, index: number) => {
    if (message.type === "tool_call_progress") {
      return <ToolCall key={`tool-${message.id}-${index}`} toolCall={message} />;
    }

    const isUser = message.role === "user";
    const content = message.content?.[0];
    
    if (!content) return null;

    return (
      <div key={index} className={`flex items-start space-x-4 animate-fade-in ${isUser ? 'justify-end' : ''}`}>
        {!isUser && (
          <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
            <i className="fas fa-robot text-primary-foreground text-sm"></i>
          </div>
        )}
        
        <Card className={`p-4 shadow-sm ${isUser ? 'bg-primary text-primary-foreground max-w-2xl' : 'bg-card text-card-foreground flex-1'}`}>
          {content.type === "output_text" ? (
            <ReactMarkdown className="prose prose-sm max-w-none dark:prose-invert">
              {content.text}
            </ReactMarkdown>
          ) : (
            <p>{content.text}</p>
          )}
        </Card>

        {isUser && (
          <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center flex-shrink-0">
            <i className="fas fa-user text-secondary-foreground text-sm"></i>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <div className={`w-80 bg-card border-r border-border flex flex-col transition-all duration-300 ease-in-out lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} fixed lg:relative z-30 h-full`}>
        <ToolsPanel onClose={() => setSidebarOpen(false)} />
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-card border-b border-border p-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden"
              data-testid="toggle-sidebar"
            >
              <i className="fas fa-bars text-muted-foreground"></i>
            </Button>
            <div>
              <h1 className="font-semibold text-foreground">AI Assistant</h1>
              <p className="text-sm text-muted-foreground">Powered by OpenAI Responses API</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant="secondary" className="bg-accent/10 text-accent">
              <span className="w-2 h-2 bg-accent rounded-full mr-2 animate-pulse"></span>
              Online
            </Badge>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6" data-testid="chat-container">
          {chatMessages.map((message, index) => renderMessage(message, index))}
          
          {isAssistantLoading && (
            <div className="flex items-start space-x-4 animate-fade-in">
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                <i className="fas fa-robot text-primary-foreground text-sm"></i>
              </div>
              <Card className="flex-1 bg-card p-4 shadow-sm border border-border">
                <p className="text-foreground typing-indicator">Thinking...</p>
              </Card>
            </div>
          )}
        </div>

        {/* Input */}
        <div className="bg-card border-t border-border p-4">
          <div className="max-w-4xl mx-auto">
            <ChatInput onSendMessage={handleSendMessage} disabled={isAssistantLoading} />
            <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
              <span>Press Enter to send, Shift+Enter for new line</span>
              <div className="flex items-center space-x-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={resetConversation}
                  className="text-xs"
                  data-testid="button-clear-conversation"
                >
                  Clear Chat
                </Button>
                <span>Model: GPT-5</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Overlay for mobile sidebar */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-20 lg:hidden" 
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}
