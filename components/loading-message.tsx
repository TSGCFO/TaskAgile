import React from "react";

const LoadingMessage: React.FC = () => {
  return (
    <div className="text-base animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div className="flex flex-col">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center text-white font-bold shadow-lg animate-pulse">
            AI
          </div>
          <div className="mr-4 md:mr-24 max-w-[75%]">
            <div className="rounded-2xl px-5 py-4 bg-white border-2 border-purple-100 shadow-lg">
              <div className="flex space-x-2">
                <div className="w-3 h-3 animate-bounce bg-purple-500 rounded-full" style={{animationDelay: '0ms'}}/>
                <div className="w-3 h-3 animate-bounce bg-purple-500 rounded-full" style={{animationDelay: '200ms'}}/>
                <div className="w-3 h-3 animate-bounce bg-purple-500 rounded-full" style={{animationDelay: '400ms'}}/>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingMessage;