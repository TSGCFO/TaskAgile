import { MessageItem } from "@/lib/assistant";
import React from "react";
import ReactMarkdown from "react-markdown";

interface MessageProps {
  message: MessageItem;
}

const Message: React.FC<MessageProps> = ({ message }) => {
  return (
    <div className="text-base animate-in fade-in-0 slide-in-from-bottom-5 duration-500">
      {message.role === "user" ? (
        <div className="flex justify-end">
          <div className="max-w-[75%] group">
            <div className="relative ml-4 md:ml-24">
              <div className="absolute inset-0 bg-gradient-to-r from-primary to-accent rounded-3xl blur-lg opacity-50 group-hover:opacity-70 transition-opacity duration-300" />
              <div className="relative rounded-3xl px-6 py-4 animated-gradient text-primary-foreground shadow-2xl transition-all duration-300 hover:scale-[1.02]">
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
          <div className="flex">
            <div className="mr-4 md:mr-24 max-w-[75%] group">
              <div className="glass rounded-3xl px-6 py-4 shadow-xl transition-all duration-300 hover:shadow-2xl hover:scale-[1.02] border border-border/30">
                <div className="prose prose-sm dark:prose-invert max-w-none">
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
                        className="mt-4 max-w-full rounded-xl shadow-lg"
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