import { MessageItem } from "@/lib/assistant";
import React from "react";
import ReactMarkdown from "react-markdown";

interface MessageProps {
  message: MessageItem;
}

const Message: React.FC<MessageProps> = ({ message }) => {
  return (
    <div className="text-sm animate-in fade-in-0 slide-in-from-bottom-3 duration-300">
      {message.role === "user" ? (
        <div className="flex justify-end">
          <div className="max-w-[80%]">
            <div className="ml-4 rounded-2xl px-5 py-3 md:ml-24 bg-primary text-primary-foreground shadow-lg transition-all duration-200 hover:shadow-xl">
              <div>
                <div className="prose prose-sm prose-primary dark:prose-invert max-w-none">
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
            <div className="mr-4 rounded-2xl px-5 py-3 md:mr-24 bg-card text-card-foreground shadow-lg border border-border/50 transition-all duration-200 hover:shadow-xl max-w-[80%]">
              <div className="prose prose-sm dark:prose-invert max-w-none">
                <ReactMarkdown>
                  {message.content[0].text as string}
                </ReactMarkdown>
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
                        className="mt-2 max-w-full"
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
