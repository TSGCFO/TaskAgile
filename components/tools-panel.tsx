"use client";

import { useState, useEffect } from "react";
import useToolsStore from "@/stores/useToolsStore";
import { Button } from "./ui/button";
import { Switch } from "./ui/switch";
import { Separator } from "./ui/separator";
import { Card } from "./ui/card";
import VectorStoreModal from "./vector-store-modal";

interface ToolsPanelProps {
  onClose: () => void;
}

export default function ToolsPanel({ onClose }: ToolsPanelProps) {
  const [showVectorModal, setShowVectorModal] = useState(false);
  const [isGoogleConnected, setIsGoogleConnected] = useState(false);
  
  const {
    webSearch, setWebSearch,
    fileSearch, setFileSearch,
    codeInterpreter, setCodeInterpreter,
    weather, setWeather,
    jokes, setJokes,
    googleCalendar, setGoogleCalendar,
    googleGmail, setGoogleGmail,
    currentVectorStore,
  } = useToolsStore();

  useEffect(() => {
    checkGoogleStatus();
  }, []);

  const checkGoogleStatus = async () => {
    try {
      const response = await fetch("/api/google/status");
      const { connected } = await response.json();
      setIsGoogleConnected(connected);
    } catch (error) {
      console.error("Error checking Google status:", error);
    }
  };

  const handleGoogleConnect = () => {
    window.location.href = "/api/google/auth";
  };

  const handleGoogleDisconnect = async () => {
    // Clear cookies and reset state
    document.cookie = "gc_access_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie = "gc_refresh_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie = "gc_expires_at=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    
    setIsGoogleConnected(false);
    setGoogleCalendar(false);
    setGoogleGmail(false);
  };

  return (
    <>
      {/* Header */}
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold text-foreground">OpenAI Responses</h1>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="lg:hidden"
            data-testid="button-close-sidebar"
          >
            <i className="fas fa-times text-muted-foreground"></i>
          </Button>
        </div>
        <p className="text-sm text-muted-foreground mt-2">Configure tools and settings</p>
      </div>

      {/* Tools Configuration */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* Built-in Tools */}
        <div className="space-y-4">
          <h2 className="text-lg font-medium text-foreground">Built-in Tools</h2>
          
          {/* Web Search */}
          <Card className="bg-secondary/50 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <i className="fas fa-search text-primary"></i>
                <span className="font-medium">Web Search</span>
              </div>
              <Switch 
                checked={webSearch} 
                onCheckedChange={setWebSearch}
                data-testid="switch-web-search"
              />
            </div>
            <p className="text-sm text-muted-foreground">Enable real-time web search capabilities</p>
          </Card>

          {/* File Search */}
          <Card className="bg-secondary/50 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <i className="fas fa-file-search text-primary"></i>
                <span className="font-medium">File Search</span>
              </div>
              <Switch 
                checked={fileSearch} 
                onCheckedChange={setFileSearch}
                data-testid="switch-file-search"
              />
            </div>
            <p className="text-sm text-muted-foreground">Search through uploaded documents</p>
            <Button
              variant="link"
              size="sm"
              onClick={() => setShowVectorModal(true)}
              className="w-full text-left justify-start p-0 h-auto text-sm text-primary"
              data-testid="button-manage-vector-stores"
            >
              <i className="fas fa-cog mr-1"></i>
              Manage Vector Stores
            </Button>
          </Card>

          {/* Code Interpreter */}
          <Card className="bg-secondary/50 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <i className="fas fa-code text-primary"></i>
                <span className="font-medium">Code Interpreter</span>
              </div>
              <Switch 
                checked={codeInterpreter} 
                onCheckedChange={setCodeInterpreter}
                data-testid="switch-code-interpreter"
              />
            </div>
            <p className="text-sm text-muted-foreground">Execute Python code and data analysis</p>
          </Card>
        </div>

        <Separator />

        {/* Custom Functions */}
        <div className="space-y-4">
          <h2 className="text-lg font-medium text-foreground">Custom Functions</h2>
          
          <Card className="bg-secondary/50 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <i className="fas fa-cloud-sun text-primary"></i>
                <span className="font-medium">Weather</span>
              </div>
              <Switch 
                checked={weather} 
                onCheckedChange={setWeather}
                data-testid="switch-weather"
              />
            </div>
            <p className="text-sm text-muted-foreground">Get current weather information</p>
          </Card>

          <Card className="bg-secondary/50 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <i className="fas fa-laugh text-primary"></i>
                <span className="font-medium">Programming Jokes</span>
              </div>
              <Switch 
                checked={jokes} 
                onCheckedChange={setJokes}
                data-testid="switch-jokes"
              />
            </div>
            <p className="text-sm text-muted-foreground">Get random programming jokes</p>
          </Card>
        </div>

        <Separator />

        {/* Google Integration */}
        <div className="space-y-4">
          <h2 className="text-lg font-medium text-foreground">Google Integration</h2>
          
          <Card className="bg-secondary/50 p-4 space-y-4">
            {!isGoogleConnected ? (
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <i className="fab fa-google text-red-500"></i>
                  <span className="font-medium">Not Connected</span>
                </div>
                <p className="text-sm text-muted-foreground">Connect to access Calendar and Gmail</p>
                <Button
                  onClick={handleGoogleConnect}
                  className="w-full"
                  data-testid="button-connect-google"
                >
                  <i className="fab fa-google mr-2"></i>
                  Connect Google Account
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <i className="fab fa-google text-accent"></i>
                  <span className="font-medium text-accent">Connected</span>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <i className="fas fa-calendar text-sm"></i>
                      <span className="text-sm">Calendar</span>
                    </div>
                    <Switch 
                      checked={googleCalendar} 
                      onCheckedChange={setGoogleCalendar}
                      data-testid="switch-google-calendar"
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <i className="fas fa-envelope text-sm"></i>
                      <span className="text-sm">Gmail</span>
                    </div>
                    <Switch 
                      checked={googleGmail} 
                      onCheckedChange={setGoogleGmail}
                      data-testid="switch-google-gmail"
                    />
                  </div>
                </div>
                
                <Button
                  variant="destructive"
                  onClick={handleGoogleDisconnect}
                  className="w-full text-sm"
                  data-testid="button-disconnect-google"
                >
                  Disconnect Account
                </Button>
              </div>
            )}
          </Card>
        </div>

        <Separator />

        {/* Vector Store Management */}
        <div className="space-y-4">
          <h2 className="text-lg font-medium text-foreground">Vector Stores</h2>
          
          <Card className="bg-secondary/50 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-medium">Current Store</span>
              <Button
                variant="link"
                size="sm"
                onClick={() => setShowVectorModal(true)}
                className="text-sm text-primary p-0 h-auto"
                data-testid="button-create-vector-store"
              >
                <i className="fas fa-plus mr-1"></i>
                Create New
              </Button>
            </div>
            <div className="text-sm text-muted-foreground">
              <span data-testid="text-current-vector-store">{currentVectorStore.name}</span>
              <span className="block text-xs">Ready for file search</span>
            </div>
            <Button
              variant="secondary"
              onClick={() => setShowVectorModal(true)}
              className="w-full"
              data-testid="button-upload-files"
            >
              <i className="fas fa-upload mr-2"></i>
              Upload Files
            </Button>
          </Card>
        </div>
      </div>

      <VectorStoreModal 
        open={showVectorModal} 
        onOpenChange={setShowVectorModal} 
      />
    </>
  );
}
