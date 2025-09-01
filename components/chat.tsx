"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import ToolCall from "./tool-call";
import Message from "./message";
import Annotations from "./annotations";
import McpToolsList from "./mcp-tools-list";
import McpApproval from "./mcp-approval";
import { Item, McpApprovalRequestItem } from "@/lib/assistant";
import LoadingMessage from "./loading-message";
import useConversationStore from "@/stores/useConversationStore";

interface ChatProps {
  items: Item[];
  onSendMessage: (message: string) => void;
  onApprovalResponse: (approve: boolean, id: string) => void;
}

const Chat: React.FC<ChatProps> = ({
  items,
  onSendMessage,
  onApprovalResponse,
}) => {
  const itemsEndRef = useRef<HTMLDivElement>(null);
  const [inputMessageText, setinputMessageText] = useState<string>("");
  // This state is used to provide better user experience for non-English IMEs such as Japanese
  const [isComposing, setIsComposing] = useState(false);
  const { isAssistantLoading } = useConversationStore();

  const scrollToBottom = () => {
    itemsEndRef.current?.scrollIntoView({ behavior: "instant" });
  };

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (event.key === "Enter" && !event.shiftKey && !isComposing) {
        event.preventDefault();
        onSendMessage(inputMessageText);
        setinputMessageText("");
      }
    },
    [onSendMessage, inputMessageText, isComposing],
  );

  useEffect(() => {
    scrollToBottom();
  }, [items]);

  return (
    <div className="flex justify-center items-center size-full">
      <div className="flex grow flex-col h-full w-full">
        <div className="flex-1 overflow-y-auto px-6 flex flex-col bg-white/60 backdrop-blur-sm rounded-t-2xl shadow-inner">
          <div className="mt-auto space-y-4 pt-6 pb-4">
            {items.map((item, index) => (
              <React.Fragment key={index}>
                {item.type === "tool_call" ? (
                  <ToolCall toolCall={item} />
                ) : item.type === "message" ? (
                  <div className="flex flex-col gap-1">
                    <Message message={item} />
                    {item.content &&
                      item.content[0].annotations &&
                      item.content[0].annotations.length > 0 && (
                        <Annotations
                          annotations={item.content[0].annotations}
                        />
                      )}
                  </div>
                ) : item.type === "mcp_list_tools" ? (
                  <McpToolsList item={item} />
                ) : item.type === "mcp_approval_request" ? (
                  <McpApproval
                    item={item as McpApprovalRequestItem}
                    onRespond={onApprovalResponse}
                  />
                ) : null}
              </React.Fragment>
            ))}
            {isAssistantLoading && <LoadingMessage />}
            <div ref={itemsEndRef} />
          </div>
        </div>
        <div className="p-6 bg-white/80 backdrop-blur-xl rounded-b-2xl shadow-xl border-t border-purple-100">
          <div className="max-w-[850px] mx-auto">
            <div className="flex items-center bg-white rounded-2xl border-2 border-purple-200 shadow-lg hover:shadow-xl transition-all duration-300 focus-within:border-purple-400">
              <div className="flex-1 px-6">
                <textarea
                  id="prompt-textarea"
                  tabIndex={0}
                  dir="auto"
                  rows={2}
                  placeholder="Ask me anything..."
                  className="w-full resize-none border-0 focus:outline-none text-base bg-transparent py-4 placeholder:text-purple-300 font-medium"
                  value={inputMessageText}
                  onChange={(e) => setinputMessageText(e.target.value)}
                  onKeyDown={handleKeyDown}
                  onCompositionStart={() => setIsComposing(true)}
                  onCompositionEnd={() => setIsComposing(false)}
                />
              </div>
              <div className="px-4">
                <button
                  disabled={!inputMessageText}
                  data-testid="send-button"
                  className="flex size-12 items-center justify-center rounded-xl gradient-primary text-white transition-all duration-300 hover:scale-110 hover:shadow-lg disabled:bg-gray-300 disabled:text-gray-500 disabled:opacity-50 disabled:hover:scale-100"
                  onClick={() => {
                    onSendMessage(inputMessageText);
                    setinputMessageText("");
                  }}
                >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="32"
                      height="32"
                      fill="none"
                      viewBox="0 0 32 32"
                      className="icon-2xl"
                    >
                      <path
                        fill="currentColor"
                        fillRule="evenodd"
                        d="M15.192 8.906a1.143 1.143 0 0 1 1.616 0l5.143 5.143a1.143 1.143 0 0 1-1.616 1.616l-3.192-3.192v9.813a1.143 1.143 0 0 1-2.286 0v-9.813l-3.192 3.192a1.143 1.143 0 1 1-1.616-1.616z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
