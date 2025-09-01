import React from "react";

const LoadingMessage: React.FC = () => {
  return (
    <div className="text-sm animate-in fade-in-0 duration-300">
      <div className="flex flex-col">
        <div className="flex">
          <div className="mr-4 rounded-2xl px-5 py-3 md:mr-24 bg-card text-card-foreground shadow-lg border border-border/50 transition-all duration-200">
            <div className="flex space-x-2">
              <div className="w-2 h-2 animate-bounce bg-primary rounded-full" style={{animationDelay: '0ms'}}/>
              <div className="w-2 h-2 animate-bounce bg-primary rounded-full" style={{animationDelay: '150ms'}}/>
              <div className="w-2 h-2 animate-bounce bg-primary rounded-full" style={{animationDelay: '300ms'}}/>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingMessage;
