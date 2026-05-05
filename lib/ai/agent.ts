// lib/ai/agent.ts
// Agentic loop powered by Groq (llama-3.3-70b-versatile with tool use)
// Calls tools autonomously until the trip plan is complete.

import { Groq } from "groq-sdk";
import { TRAVEL_TOOLS } from "./tools";
import { executeTool } from "./tool-executor";

const groq = new Groq({ apiKey: process.env.GROQ_API });

const SYSTEM_PROMPT = `You are WanderWay AI, an expert autonomous travel planner for Indian destinations.

When a user asks you to plan a trip, you MUST call tools in this order:
1. get_attractions — find what to see
2. get_weather_forecast — check the weather (use realistic lat/lon for the destination)
3. search_flights — find flights (use IATA codes: BLR=Bangalore, DEL=Delhi, BOM=Mumbai, GOI=Goa, IXM=Madurai, IXC=Chandigarh, etc.)
4. search_hotels — find accommodation
5. estimate_trip_budget — calculate costs
6. get_local_transport — find how to get around
7. create_itinerary — build the final day-by-day plan LAST

Call ALL relevant tools before giving a final answer. Never give a trip plan without using tools first.

After all tools complete, write a warm, structured response with:
- ✈️ Flight options (cheapest + recommended)
- 🏨 Hotel recommendation
- 🌤️ Weather summary
- 📍 Day-by-day itinerary highlights
- 💰 Budget breakdown
- 🚗 Transport tips

For general travel questions (not trip planning), answer helpfully from your knowledge.
Keep responses friendly, detailed, and enthusiastic about travel.`;

export interface TripPlanResult {
  plan: string;
  toolCallsMade: string[];
  waypoints: Array<{ name: string; latitude: number; longitude: number; day: number }>;
  budgetBreakdown?: Record<string, number>;
  weatherData?: Record<string, unknown>;
}

export async function planTrip({
  userMessage,
  conversationHistory = [],
}: {
  userMessage: string;
  conversationHistory?: Array<{ role: "user" | "assistant"; content: string }>;
}): Promise<TripPlanResult> {
  const messages: Groq.Chat.ChatCompletionMessageParam[] = [
    ...conversationHistory.map((m) => ({
      role: m.role as "user" | "assistant",
      content: m.content,
    })),
    { role: "user", content: userMessage },
  ];

  const toolCallsMade: string[] = [];
  let waypoints: TripPlanResult["waypoints"] = [];
  let budgetBreakdown: Record<string, number> | undefined;
  let weatherData: Record<string, unknown> | undefined;

  const MAX_ITERATIONS = 20;
  let iteration = 0;

  // Agentic loop — keeps going until model returns a final text response
  while (iteration < MAX_ITERATIONS) {
    iteration++;

    const response = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [{ role: "system", content: SYSTEM_PROMPT }, ...messages],
      tools: TRAVEL_TOOLS,
      tool_choice: "auto",
      temperature: 0.6,
      max_tokens: 4096,
    });

    const choice = response.choices[0];
    const assistantMessage = choice.message;

    // Push assistant message to history
    messages.push({
      role: "assistant",
      content: assistantMessage.content || "",
      ...(assistantMessage.tool_calls ? { tool_calls: assistantMessage.tool_calls } : {}),
    } as Groq.Chat.ChatCompletionMessageParam);

    // If no tool calls, we have the final answer
    if (!assistantMessage.tool_calls || assistantMessage.tool_calls.length === 0) {
      return {
        plan: assistantMessage.content || "I could not generate a trip plan. Please try again.",
        toolCallsMade,
        waypoints,
        budgetBreakdown,
        weatherData,
      };
    }

    // Execute each tool call
    for (const toolCall of assistantMessage.tool_calls) {
      const toolName = toolCall.function.name;
      toolCallsMade.push(toolName);

      let args: Record<string, unknown> = {};
      try {
        args = JSON.parse(toolCall.function.arguments);
      } catch {
        args = {};
      }

      const result = await executeTool(toolName, args);

      // Extract useful data from tool results
      try {
        const parsed = JSON.parse(result);
        if (toolName === "create_itinerary" && parsed.waypoints) {
          waypoints = parsed.waypoints;
        }
        if (toolName === "estimate_trip_budget" && parsed.breakdown) {
          budgetBreakdown = parsed.breakdown;
        }
        if (toolName === "get_weather_forecast" && parsed.forecast) {
          weatherData = parsed;
        }
      } catch {
        // Non-JSON result, ignore
      }

      // Feed tool result back to the model
      messages.push({
        role: "tool",
        tool_call_id: toolCall.id,
        content: result,
      } as Groq.Chat.ChatCompletionMessageParam);
    }
  }

  return {
    plan: "Trip planning took too long. Please try a simpler request.",
    toolCallsMade,
    waypoints,
  };
}

// For ongoing chat (after trip is planned) — simpler, no tool forcing
export async function chatWithAssistant({
  userMessage,
  conversationHistory = [],
  tripContext = "",
}: {
  userMessage: string;
  conversationHistory?: Array<{ role: "user" | "assistant"; content: string }>;
  tripContext?: string;
}): Promise<string> {
  const systemPrompt = `You are WanderWay AI, a friendly travel companion helping users with their trip.
${tripContext ? `Current trip context: ${tripContext}` : ""}

Answer travel questions helpfully. For transport/rental questions, give practical advice.
You can also use tools to search for updated information if needed.`;

  const response = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [
      { role: "system", content: systemPrompt },
      ...conversationHistory.map((m) => ({ role: m.role as "user" | "assistant", content: m.content })),
      { role: "user", content: userMessage },
    ],
    tools: TRAVEL_TOOLS,
    tool_choice: "auto",
    temperature: 0.7,
    max_tokens: 1024,
  });

  const choice = response.choices[0];
  const msg = choice.message;

  // If tool was called, execute and get final response
  if (msg.tool_calls && msg.tool_calls.length > 0) {
    const toolMessages: Groq.Chat.ChatCompletionMessageParam[] = [
      { role: "system", content: systemPrompt },
      ...conversationHistory.map((m) => ({ role: m.role as "user" | "assistant", content: m.content })),
      { role: "user", content: userMessage },
      { role: "assistant", content: msg.content || "", tool_calls: msg.tool_calls } as Groq.Chat.ChatCompletionMessageParam,
    ];

    for (const toolCall of msg.tool_calls) {
      let args: Record<string, unknown> = {};
      try { args = JSON.parse(toolCall.function.arguments); } catch { /* ignore */ }
      const result = await executeTool(toolCall.function.name, args);
      toolMessages.push({ role: "tool", tool_call_id: toolCall.id, content: result } as Groq.Chat.ChatCompletionMessageParam);
    }

    const finalResponse = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: toolMessages,
      temperature: 0.7,
      max_tokens: 1024,
    });

    return finalResponse.choices[0].message.content || "Could not get a response. Please try again.";
  }

  return msg.content || "Could not get a response. Please try again.";
}