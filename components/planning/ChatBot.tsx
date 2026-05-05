"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  Send, Bot, User, Loader2, Sparkles, Map, Wrench,
  Plane, Hotel, Cloud, List, Wallet, Car, Zap
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Message {
  role: "user" | "assistant";
  content: string;
  toolsUsed?: string[];
  waypoints?: Array<{ name: string; latitude: number; longitude: number; day: number }>;
  isPlanning?: boolean;
}

const TOOL_ICONS: Record<string, React.ReactNode> = {
  search_flights: <Plane size={10} />,
  search_hotels: <Hotel size={10} />,
  get_weather_forecast: <Cloud size={10} />,
  get_attractions: <Map size={10} />,
  estimate_trip_budget: <Wallet size={10} />,
  create_itinerary: <List size={10} />,
  get_local_transport: <Car size={10} />,
};

const TOOL_LABELS: Record<string, string> = {
  search_flights: "Flights",
  search_hotels: "Hotels",
  get_weather_forecast: "Weather",
  get_attractions: "Attractions",
  estimate_trip_budget: "Budget",
  create_itinerary: "Itinerary",
  get_local_transport: "Transport",
};

const PLANNING_KEYWORDS = [
  "plan", "trip", "travel", "visit", "go to", "explore", "holiday",
  "vacation", "tour", "days in", "weekend in", "itinerary"
];

function isPlanningRequest(message: string): boolean {
  const lower = message.toLowerCase();
  return PLANNING_KEYWORDS.some(k => lower.includes(k));
}

// Generate a stable thread ID for this session
function getThreadId(): string {
  if (typeof window === "undefined") return "server";
  let id = sessionStorage.getItem("wandr-thread-id");
  if (!id) {
    id = `thread-${Date.now()}-${Math.random().toString(36).slice(2)}`;
    sessionStorage.setItem("wandr-thread-id", id);
  }
  return id;
}

interface ChatBotProps {
  onWaypointsUpdate?: (waypoints: Array<{ name: string; latitude: number; longitude: number; day: number }>) => void;
}

const ChatBot: React.FC<ChatBotProps> = ({ onWaypointsUpdate }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Hello! I'm your WanderWay AI assistant 🌍\n\nTell me where you'd like to go and I'll plan your entire trip — flights, hotels, weather, itinerary and budget — all in one go!\n\nTry: **\"Plan a 4-day trip to Goa for 2 people\"**",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [planningStatus, setPlanningStatus] = useState<string>("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const threadId = useRef<string>("");

  useEffect(() => {
    threadId.current = getThreadId();
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading, planningStatus]);

  const handleSend = useCallback(async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    const isPlanning = isPlanningRequest(userMessage);

    setMessages(prev => [...prev, { role: "user", content: userMessage }]);
    setInput("");
    setIsLoading(true);

    if (isPlanning) {
      setPlanningStatus("🔍 Searching for attractions...");
    }

    try {
      const endpoint = isPlanning ? "/api/plan" : "/api/chat";
      const body = isPlanning
        ? { message: userMessage, threadId: threadId.current }
        : {
          messages: [
            ...messages.map(m => ({ role: m.role, content: m.content })),
            { role: "user", content: userMessage },
          ],
          threadId: threadId.current,
        };

      if (isPlanning) {
        // Show progressive status updates
        const statuses = [
          "🌤️ Checking weather forecasts...",
          "✈️ Searching for flights...",
          "🏨 Finding best hotels...",
          "💰 Calculating budget...",
          "📍 Building your itinerary...",
        ];
        let statusIdx = 0;
        const statusInterval = setInterval(() => {
          if (statusIdx < statuses.length) {
            setPlanningStatus(statuses[statusIdx++]);
          }
        }, 3000);

        const response = await fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });

        clearInterval(statusInterval);
        setPlanningStatus("");

        const data = await response.json();

        if (data.message) {
          const newMsg: Message = {
            role: "assistant",
            content: data.message,
            toolsUsed: data.toolsUsed,
            waypoints: data.waypoints,
            isPlanning: true,
          };
          setMessages(prev => [...prev, newMsg]);

          if (data.waypoints?.length > 0 && onWaypointsUpdate) {
            onWaypointsUpdate(data.waypoints);
          }
        } else {
          throw new Error(data.error || "Planning failed");
        }
      } else {
        const response = await fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });

        const data = await response.json();

        if (data.message) {
          setMessages(prev => [...prev, { role: "assistant", content: data.message }]);
        } else {
          throw new Error(data.error || "Something went wrong");
        }
      }
    } catch (error) {
      console.error("Chat Error:", error);
      setPlanningStatus("");
      setMessages(prev => [
        ...prev,
        {
          role: "assistant",
          content: "I'm having trouble connecting right now. Please check your API keys are configured and try again.",
        },
      ]);
    } finally {
      setIsLoading(false);
      setPlanningStatus("");
    }
  }, [input, isLoading, messages, onWaypointsUpdate]);

  const formatContent = (content: string) => {
    // Simple markdown-like formatting
    return content
      .split("\n")
      .map((line, i) => {
        if (line.startsWith("**") && line.endsWith("**")) {
          return <p key={i} className="font-bold mt-2 mb-1">{line.slice(2, -2)}</p>;
        }
        if (line.startsWith("# ")) {
          return <p key={i} className="font-bold text-base mt-3 mb-1">{line.slice(2)}</p>;
        }
        if (line.startsWith("## ")) {
          return <p key={i} className="font-semibold mt-2 mb-1">{line.slice(3)}</p>;
        }
        if (line.startsWith("- ") || line.startsWith("• ")) {
          return <p key={i} className="pl-3 before:content-['•'] before:mr-2 before:text-primary">{line.slice(2)}</p>;
        }
        if (line.trim() === "") return <div key={i} className="h-2" />;
        // Bold inline
        const boldParts = line.split(/\*\*(.*?)\*\*/g);
        if (boldParts.length > 1) {
          return (
            <p key={i}>
              {boldParts.map((part, j) => j % 2 === 1 ? <strong key={j}>{part}</strong> : part)}
            </p>
          );
        }
        return <p key={i}>{line}</p>;
      });
  };

  return (
    <div className="flex flex-col h-[600px] w-full bg-card/50 backdrop-blur-xl border border-border/50 rounded-3xl overflow-hidden shadow-2xl shadow-primary/5">
      {/* Header */}
      <div className="p-4 bg-primary text-primary-foreground flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="bg-primary-foreground/20 p-2 rounded-xl">
            <Bot size={20} className="text-secondary" />
          </div>
          <div>
            <h3 className="font-eagle font-bold text-sm tracking-wide">WanderWay AI</h3>
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 bg-secondary rounded-full animate-pulse" />
              <span className="text-[10px] opacity-80 uppercase tracking-widest font-medium">
                {isLoading ? "Planning..." : "Online"}
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 opacity-60">
          <Zap size={14} className="text-secondary" />
          <span className="text-[10px] uppercase tracking-widest">Groq Powered</span>
        </div>
      </div>

      {/* Messages */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 space-y-4 scroll-smooth"
      >
        {messages.map((msg, i) => (
          <div
            key={i}
            className={cn(
              "flex w-full",
              msg.role === "user" ? "justify-end" : "justify-start"
            )}
          >
            <div
              className={cn(
                "max-w-[88%] px-4 py-3 rounded-2xl text-sm leading-relaxed",
                msg.role === "user"
                  ? "bg-primary text-primary-foreground rounded-tr-none shadow-md shadow-primary/10"
                  : "bg-muted text-foreground rounded-tl-none border border-border/30"
              )}
            >
              {/* Role label */}
              <div className="flex items-center gap-2 mb-1.5 opacity-60">
                {msg.role === "user" ? <User size={12} /> : <Bot size={12} />}
                <span className="text-[10px] font-bold uppercase tracking-tighter">
                  {msg.role === "user" ? "You" : "WanderWay AI"}
                </span>
              </div>

              {/* Content */}
              <div className="space-y-0.5">
                {msg.role === "assistant" ? formatContent(msg.content) : msg.content}
              </div>

              {/* Tool pills */}
              {msg.toolsUsed && msg.toolsUsed.length > 0 && (
                <div className="mt-3 pt-3 border-t border-border/30 flex flex-wrap gap-1.5">
                  <span className="text-[10px] text-muted-foreground flex items-center gap-1 w-full mb-1">
                    <Wrench size={10} /> Tools used:
                  </span>
                  {msg.toolsUsed.map((tool, j) => (
                    <span
                      key={j}
                      className="inline-flex items-center gap-1 bg-primary/10 text-primary text-[10px] px-2 py-0.5 rounded-full font-medium border border-primary/20"
                    >
                      {TOOL_ICONS[tool] || <Zap size={10} />}
                      {TOOL_LABELS[tool] || tool}
                    </span>
                  ))}
                </div>
              )}

              {/* Waypoint count */}
              {msg.waypoints && msg.waypoints.length > 0 && (
                <div className="mt-2 flex items-center gap-1.5 text-[10px] text-primary font-medium">
                  <Map size={10} />
                  <span>{msg.waypoints.length} locations added to map</span>
                </div>
              )}
            </div>
          </div>
        ))}

        {/* Loading / planning status */}
        {isLoading && (
          <div className="flex justify-start max-w-[88%]">
            <div className="bg-muted px-4 py-3 rounded-2xl rounded-tl-none border border-border/30">
              <div className="flex items-center gap-2">
                <Loader2 size={14} className="animate-spin text-primary" />
                <span className="text-xs text-muted-foreground italic">
                  {planningStatus || "Thinking..."}
                </span>
              </div>
              {planningStatus && (
                <div className="mt-2 flex gap-1">
                  {[0, 1, 2].map(i => (
                    <span
                      key={i}
                      className="w-1.5 h-1.5 bg-primary/40 rounded-full animate-bounce"
                      style={{ animationDelay: `${i * 0.15}s` }}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Quick suggestions */}
      {messages.length === 1 && (
        <div className="px-4 pb-2 flex gap-2 overflow-x-auto shrink-0">
          {[
            "Plan a 3-day trip to Goa",
            "Weekend in Manali for 2",
            "5 days in Rajasthan",
          ].map((suggestion, i) => (
            <button
              key={i}
              onClick={() => setInput(suggestion)}
              className="shrink-0 text-xs bg-primary/10 text-primary border border-primary/20 px-3 py-1.5 rounded-full hover:bg-primary/20 transition-colors font-medium"
            >
              {suggestion}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <div className="p-4 bg-background/50 border-t border-border/30 shrink-0">
        <div className="relative flex items-center gap-2 bg-muted/50 p-1.5 rounded-2xl border border-border/50 focus-within:border-primary/50 focus-within:ring-4 focus-within:ring-primary/5 transition-all duration-300">
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === "Enter" && !e.shiftKey && handleSend()}
            placeholder="Plan a trip to Goa for 3 days..."
            className="flex-1 bg-transparent border-none focus:ring-0 text-sm px-3 py-2 text-foreground placeholder:text-muted-foreground/60 font-milkywalky"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className={cn(
              "p-2.5 rounded-xl transition-all duration-300",
              input.trim() && !isLoading
                ? "bg-secondary text-secondary-foreground shadow-lg shadow-secondary/20 hover:scale-105 active:scale-95"
                : "bg-muted text-muted-foreground opacity-50 cursor-not-allowed"
            )}
          >
            <Send size={18} />
          </button>
        </div>
        <p className="text-[10px] text-muted-foreground text-center mt-2">
          Powered by Groq · Llama 3.3 70B · Tool Use enabled
        </p>
      </div>
    </div>
  );
};

export default ChatBot;