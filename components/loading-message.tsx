import React from "react";

const LoadingMessage: React.FC = () => {
  return (
    <div className="text-base animate-in fade-in-0 slide-in-from-bottom-3 duration-500">
      <div className="flex flex-col">
        <div className="flex">
          <div className="mr-4 md:mr-24 max-w-[75%]">
            <div className="glass rounded-3xl px-6 py-4 shadow-xl border border-border/30">
              <div className="flex space-x-3">
                <div className="w-3 h-3 animate-bounce animated-gradient rounded-full" style={{animationDelay: '0ms'}}/>
                <div className="w-3 h-3 animate-bounce animated-gradient rounded-full" style={{animationDelay: '200ms'}}/>
                <div className="w-3 h-3 animate-bounce animated-gradient rounded-full" style={{animationDelay: '400ms'}}/>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingMessage;
