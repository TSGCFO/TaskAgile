import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "OpenAI Responses API Starter",
  description: "A Next.js starter app built on the OpenAI Responses API with streaming and tool calling",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">
        <div className="flex h-screen bg-background w-full flex-col text-foreground">
          <main className="flex-1">{children}</main>
        </div>
      </body>
    </html>
  );
}
