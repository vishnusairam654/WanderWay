// app/api/plan/route.ts
// Main planning endpoint. Loads history from Redis, calls the AI agentic loop,
// saves updated history, and persists the trip plan to Supabase.

import { NextResponse } from "next/server";
import { planTrip } from "@/lib/ai/agent";
import { getChatHistory, saveChatHistory } from "@/lib/redis/client";

export async function POST(req: Request) {
    try {
        const { message, threadId } = await req.json();

        if (!message || !threadId) {
            return NextResponse.json({ error: "message and threadId are required" }, { status: 400 });
        }

        // Load conversation history from Redis
        const history = await getChatHistory(threadId);

        // Run the agentic planning loop
        const result = await planTrip({
            userMessage: message,
            conversationHistory: history,
        });

        // Update conversation history
        const updatedHistory = [
            ...history,
            { role: "user" as const, content: message },
            { role: "assistant" as const, content: result.plan },
        ];
        await saveChatHistory(threadId, updatedHistory);

        // Attempt to save trip to Supabase (non-fatal if it fails)
        if (result.waypoints.length > 0) {
            try {
                const { createClient } = await import("@/lib/supabase/server");
                const supabase = await createClient();
                await supabase.from("trips").upsert(
                    {
                        thread_id: threadId,
                        destination: extractDestination(message),
                        plan_data: {
                            plan: result.plan,
                            toolsUsed: result.toolCallsMade,
                            budgetBreakdown: result.budgetBreakdown,
                            weatherData: result.weatherData,
                        },
                        map_waypoints: result.waypoints,
                        updated_at: new Date().toISOString(),
                    },
                    { onConflict: "thread_id" }
                );
            } catch {
                // Supabase save failure is non-fatal
                console.warn("Supabase save skipped (no credentials or schema not set up)");
            }
        }

        return NextResponse.json({
            message: result.plan,
            toolsUsed: result.toolCallsMade,
            waypoints: result.waypoints,
            budgetBreakdown: result.budgetBreakdown,
            weatherData: result.weatherData,
        });
    } catch (error: unknown) {
        console.error("Plan API error:", error);
        const message = error instanceof Error ? error.message : "Unknown error";
        return NextResponse.json({ error: "Planning failed", details: message }, { status: 500 });
    }
}

function extractDestination(message: string): string {
    // Very rough destination extraction for the DB record
    const words = message.toLowerCase().split(" ");
    const toIndex = words.indexOf("to");
    if (toIndex !== -1 && words[toIndex + 1]) {
        return words[toIndex + 1].charAt(0).toUpperCase() + words[toIndex + 1].slice(1);
    }
    return "Unknown";
}