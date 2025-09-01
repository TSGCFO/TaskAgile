"use client";

import { Badge } from "./ui/badge";
import { Card } from "./ui/card";
import { Progress } from "./ui/progress";

interface ToolCallProps {
  toolCall: {
    id: string;
    name: string;
    status: "executing" | "completed" | "error" | "queued";
    progress: number;
    result?: any;
    error?: string;
  };
}

export default function ToolCall({ toolCall }: ToolCallProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "executing":
        return "bg-accent/10 text-accent";
      case "completed":
        return "bg-accent/10 text-accent";
      case "error":
        return "bg-destructive/10 text-destructive";
      case "queued":
        return "bg-muted text-muted-foreground";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const getIcon = (name: string) => {
    switch (name) {
      case "get_weather":
        return "fas fa-cloud-sun";
      case "get_joke":
        return "fas fa-laugh";
      default:
        return "fas fa-cog";
    }
  };

  return (
    <div className="flex items-start space-x-4 animate-slide-up">
      <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
        <i className="fas fa-robot text-primary-foreground text-sm"></i>
      </div>
      <div className="flex-1 space-y-3">
        {/* Tool Call Progress */}
        <Card className="p-4 shadow-sm border border-border">
          <div className="flex items-center space-x-3 mb-3">
            <i className={`${getIcon(toolCall.name)} text-primary`}></i>
            <span className="font-medium text-foreground">{toolCall.name.replace('_', ' ')}</span>
            <div className="flex-1 flex justify-end">
              <Badge className={getStatusColor(toolCall.status)}>
                {toolCall.status === "executing" && (
                  <span className="w-2 h-2 bg-accent rounded-full mr-2 animate-pulse"></span>
                )}
                {toolCall.status === "completed" && (
                  <i className="fas fa-check mr-2 text-sm"></i>
                )}
                {toolCall.status === "error" && (
                  <i className="fas fa-times mr-2 text-sm"></i>
                )}
                {toolCall.status.charAt(0).toUpperCase() + toolCall.status.slice(1)}
              </Badge>
            </div>
          </div>
          <Progress 
            value={toolCall.progress} 
            className="w-full h-2"
            data-testid={`progress-${toolCall.id}`}
          />
        </Card>

        {/* Tool Result */}
        {toolCall.status === "completed" && toolCall.result && (
          <Card className="bg-secondary/30 p-4 border-l-4 border-accent">
            <div className="flex items-center space-x-2 mb-2">
              <i className="fas fa-check text-accent text-sm"></i>
              <span className="text-sm font-medium text-accent">
                {toolCall.name.replace('_', ' ')} Result
              </span>
            </div>
            <div className="text-sm text-muted-foreground" data-testid={`result-${toolCall.id}`}>
              {typeof toolCall.result === 'object' ? (
                <pre className="whitespace-pre-wrap font-mono text-xs">
                  {JSON.stringify(toolCall.result, null, 2)}
                </pre>
              ) : (
                toolCall.result.toString()
              )}
            </div>
          </Card>
        )}

        {/* Tool Error */}
        {toolCall.status === "error" && toolCall.error && (
          <Card className="bg-destructive/10 p-4 border-l-4 border-destructive">
            <div className="flex items-center space-x-2 mb-2">
              <i className="fas fa-exclamation-triangle text-destructive text-sm"></i>
              <span className="text-sm font-medium text-destructive">Error</span>
            </div>
            <div className="text-sm text-muted-foreground" data-testid={`error-${toolCall.id}`}>
              {toolCall.error}
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
