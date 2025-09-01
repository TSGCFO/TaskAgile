"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Save, History, Trash2, MessageSquare, Plus } from "lucide-react";
import useConversationStore from "@/stores/useConversationStore";

interface Conversation {
  id: number;
  title: string;
  createdAt: string;
  updatedAt: string;
}

export function ConversationHistory() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [saveTitle, setSaveTitle] = useState("");
  const [isSaveDialogOpen, setIsSaveDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    saveConversation,
    loadConversation,
    resetConversation,
    currentConversationId,
  } = useConversationStore();

  // Fetch conversations list
  const fetchConversations = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/conversations");
      const data = await response.json();
      setConversations(data);
    } catch (error) {
      console.error("Failed to fetch conversations:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchConversations();
    }
  }, [isOpen]);

  const handleSave = async () => {
    try {
      await saveConversation(saveTitle || undefined);
      setSaveTitle("");
      setIsSaveDialogOpen(false);
      if (isOpen) {
        fetchConversations();
      }
    } catch (error) {
      console.error("Failed to save conversation:", error);
    }
  };

  const handleLoad = async (id: number) => {
    try {
      await loadConversation(id);
      setIsOpen(false);
    } catch (error) {
      console.error("Failed to load conversation:", error);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await fetch(`/api/conversations/${id}`, {
        method: "DELETE",
      });
      fetchConversations();
    } catch (error) {
      console.error("Failed to delete conversation:", error);
    }
  };

  const handleNewConversation = () => {
    resetConversation();
    setIsOpen(false);
  };

  return (
    <div className="flex gap-3">
      {/* Save Conversation Button */}
      <Dialog open={isSaveDialogOpen} onOpenChange={setIsSaveDialogOpen}>
        <DialogTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="glass gap-2 hover:shadow-xl transition-all duration-300 hover:scale-105 border-border/30 hover:border-primary/30 group"
            title="Save current conversation"
          >
            <Save className="h-4 w-4 group-hover:text-primary transition-colors duration-300" />
            <span className="group-hover:text-primary transition-colors duration-300">Save</span>
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Save Conversation</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              placeholder="Enter a title for this conversation..."
              value={saveTitle}
              onChange={(e) => setSaveTitle(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSave()}
            />
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setIsSaveDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleSave}>Save Conversation</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* History Button */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="glass gap-2 hover:shadow-xl transition-all duration-300 hover:scale-105 border-border/30 hover:border-primary/30 group"
            title="View conversation history"
          >
            <History className="h-4 w-4 group-hover:text-primary transition-colors duration-300" />
            <span className="group-hover:text-primary transition-colors duration-300">History</span>
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-2xl max-h-[600px]">
          <DialogHeader>
            <DialogTitle>Conversation History</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            {/* New Conversation Button */}
            <Button
              onClick={handleNewConversation}
              className="w-full gap-2 animated-gradient text-primary-foreground hover:scale-[1.02] transition-all duration-300 shadow-lg hover:shadow-xl"
              variant="default"
            >
              <Plus className="h-4 w-4" />
              New Conversation
            </Button>

            {/* Conversations List */}
            <div className="space-y-2 max-h-[400px] overflow-y-auto">
              {isLoading ? (
                <div className="text-center py-4 text-muted-foreground">
                  Loading conversations...
                </div>
              ) : conversations.length === 0 ? (
                <div className="text-center py-4 text-muted-foreground">
                  No saved conversations yet
                </div>
              ) : (
                conversations.map((conv) => (
                  <div
                    key={conv.id}
                    className={`p-4 rounded-2xl border transition-all duration-300 cursor-pointer group ${
                      currentConversationId === conv.id 
                        ? "bg-gradient-to-r from-primary/20 to-accent/20 border-primary/30 shadow-lg" 
                        : "glass border-border/30 hover:border-primary/30 hover:shadow-lg hover:scale-[1.02]"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div
                        className="flex-1 flex items-center gap-2"
                        onClick={() => handleLoad(conv.id)}
                      >
                        <MessageSquare className={`h-4 w-4 transition-colors duration-300 ${
                          currentConversationId === conv.id ? "text-primary" : "text-muted-foreground group-hover:text-primary"
                        }`} />
                        <div className="flex-1">
                          <h4 className="font-medium">{conv.title}</h4>
                          <p className="text-xs text-gray-500">
                            {new Date(conv.updatedAt).toLocaleDateString()} at{" "}
                            {new Date(conv.updatedAt).toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(conv.id);
                        }}
                        className="hover:bg-destructive/10 hover:text-destructive transition-colors duration-300"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
