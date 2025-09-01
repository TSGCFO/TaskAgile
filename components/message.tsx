import { MessageItem } from "@/lib/assistant";
import React from "react";
import ReactMarkdown from "react-markdown";

interface MessageProps {
  message: MessageItem;
}

const Message: React.FC<MessageProps> = ({ message }) => {
  return (
    <div className="text-base animate-in fade-in slide-in-from-bottom-2 duration-300">
      {message.role === "user" ? (
        <div className="flex justify-end">
          <div className="max-w-[75%]">
            <div className="ml-4 md:ml-24">
              <div className="rounded-2xl px-5 py-4 gradient-primary text-white shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="prose prose-sm prose-invert max-w-none">
                  <ReactMarkdown>
                    {message.content[0].text as string}
                  </ReactMarkdown>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center text-white font-bold shadow-lg">
              AI
            </div>
            <div className="mr-4 md:mr-24 max-w-[75%]">
              <div className="rounded-2xl px-5 py-4 bg-white border-2 border-purple-100 shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="prose prose-sm max-w-none">
                  <ReactMarkdown>
                    {message.content[0].text as string}
                  </ReactMarkdown>
                </div>
                {message.content[0].annotations &&
                  message.content[0].annotations
                    .filter(
                      (a) =>
                        a.type === "container_file_citation" &&
                        a.filename &&
                        /\.(png|jpg|jpeg|gif|webp|svg)$/i.test(a.filename),
                    )
                    .map((a, i) => (
                      <img
                        key={i}
                        src={`/api/container_files/content?file_id=${a.fileId}${a.containerId ? `&container_id=${a.containerId}` : ""}${a.filename ? `&filename=${encodeURIComponent(a.filename)}` : ""}`}
                        alt={a.filename || ""}
                        className="mt-4 max-w-full rounded-lg"
                      />
                    ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Message;