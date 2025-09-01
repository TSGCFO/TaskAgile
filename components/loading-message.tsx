import React from "react";

const LoadingMessage: React.FC = () => {
  return (
    <div className="text-base">
      <div className="flex flex-col">
        <div className="flex">
          <div className="mr-4 md:mr-24 max-w-[75%]">
            <div className="rounded-lg px-4 py-3 bg-card border shadow-sm">
              <div className="flex space-x-2">
                <div className="w-2 h-2 animate-bounce bg-muted-foreground rounded-full" style={{animationDelay: '0ms'}}/>
                <div className="w-2 h-2 animate-bounce bg-muted-foreground rounded-full" style={{animationDelay: '200ms'}}/>
                <div className="w-2 h-2 animate-bounce bg-muted-foreground rounded-full" style={{animationDelay: '400ms'}}/>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingMessage;