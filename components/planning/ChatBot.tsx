"use client";

import React, { useState, useRef, useEffect } from "react";
import { Send, Bot, User, Loader2, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const ChatBot = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Hello! I'm your WanderWay AI assistant. Where would you like to explore next?",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: "user", content: input };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages }),
      });

      const data = await response.json();

      if (data.message) {
        setMessages((prev) => [...prev, { role: "assistant", content: data.message }]);
      } else {
        throw new Error(data.error || "Something went wrong");
      }
    } catch (error) {
      console.error("Chat Error:", error);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "I'm sorry, I'm having trouble connecting right now. Please try again later." },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[500px] w-full bg-card/50 backdrop-blur-xl border border-border/50 rounded-3xl overflow-hidden shadow-2xl shadow-primary/5">
      {/* Header */}
      <div className="p-4 bg-primary text-primary-foreground flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-primary-foreground/20 p-2 rounded-xl">
            <Bot size={20} className="text-secondary" />
          </div>
          <div>
            <h3 className="font-eagle font-bold text-sm tracking-wide">WanderWay AI</h3>
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 bg-secondary rounded-full animate-pulse" />
              <span className="text-[10px] opacity-80 uppercase tracking-widest font-medium">Online</span>
            </div>
          </div>
        </div>
        <button className="opacity-60 hover:opacity-100 transition-opacity">
          <Sparkles size={18} className="text-secondary" />
        </button>
      </div>

      {/* Messages area */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 space-y-4 scroll-smooth selection:bg-secondary/30"
      >
        {messages.map((msg, i) => (
          <div
            key={i}
            className={cn(
              "flex w-full max-w-[85%]",
              msg.role === "user" ? "ml-auto justify-end" : "justify-start"
            )}
          >
            <div
              className={cn(
                "px-4 py-3 rounded-2xl text-sm leading-relaxed",
                msg.role === "user"
                  ? "bg-primary text-primary-foreground rounded-tr-none shadow-md shadow-primary/10"
                  : "bg-muted text-foreground rounded-tl-none border border-border/30"
              )}
            >
              <div className="flex items-center gap-2 mb-1 opacity-60">
                {msg.role === "user" ? <User size={12} /> : <Bot size={12} />}
                <span className="text-[10px] font-bold uppercase tracking-tighter">
                  {msg.role === "user" ? "You" : "Assistant"}
                </span>
              </div>
              {msg.content}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start max-w-[85%]">
            <div className="bg-muted px-4 py-3 rounded-2xl rounded-tl-none border border-border/30 flex items-center gap-2">
              <Loader2 size={14} className="animate-spin text-primary" />
              <span className="text-xs text-muted-foreground italic">Thinking...</span>
            </div>
          </div>
        )}
      </div>

      {/* Input area */}
      <div className="p-4 bg-background/50 border-t border-border/30">
        <div className="relative flex items-center gap-2 bg-muted/50 p-1.5 rounded-2xl border border-border/50 focus-within:border-primary/50 focus-within:ring-4 focus-within:ring-primary/5 transition-all duration-300">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="Ask anything about your trip..."
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
      </div>
    </div>
  );
};

export default ChatBot;
