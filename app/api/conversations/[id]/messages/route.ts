import { NextRequest, NextResponse } from "next/server";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { messages, conversations, insertMessageSchema } from "@/shared/schema";
import { eq } from "drizzle-orm";

const client = postgres(process.env.DATABASE_URL!);
const db = drizzle(client);

// POST /api/conversations/[id]/messages - Add messages to a conversation
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const resolvedParams = await params;
    const conversationId = parseInt(resolvedParams.id);
    const body = await request.json();

    // Support both single message and array of messages
    const messagesToInsert = Array.isArray(body) ? body : [body];

    // Validate and insert messages
    const insertedMessages = await db.transaction(async (tx) => {
      // Update conversation's updatedAt timestamp
      await tx
        .update(conversations)
        .set({ updatedAt: new Date() })
        .where(eq(conversations.id, conversationId));

      // Insert all messages
      const results = [];
      for (const msg of messagesToInsert) {
        const validatedData = insertMessageSchema.parse({
          ...msg,
          conversationId,
        });

        const [inserted] = await tx
          .insert(messages)
          .values(validatedData)
          .returning();

        results.push(inserted);
      }

      return results;
    });

    return NextResponse.json(insertedMessages);
  } catch (error) {
    console.error("Error adding messages:", error);
    return NextResponse.json(
      { error: "Failed to add messages" },
      { status: 500 },
    );
  }
}
