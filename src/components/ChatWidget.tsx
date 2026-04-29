"use client";

import { useState, useEffect, useRef } from "react";
import { MessageCircle, X, Send, Loader2 } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

interface Message {
  role: "user" | "model";
  parts: [{ text: string }];
  uiOnly?: boolean;
}

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [hasOpened, setHasOpened] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const toggleChat = () => {
    if (!isOpen && !hasOpened) {
      setHasOpened(true);
      setMessages([
        {
          role: "model",
          parts: [
            {
              text: "Hi! I'm the Code Tunnel assistant. I can help you learn about our services or scope your next project. What are you looking for?",
            },
          ],
          uiOnly: true,
        },
      ]);
    }
    setIsOpen(!isOpen);
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg: Message = {
      role: "user",
      parts: [{ text: input.trim() }],
    };

    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput("");
    setIsLoading(true);

    try {
      const apiMessages = newMessages
        .filter((m) => !m.uiOnly)
        .map(({ role, parts }) => ({ role, parts }));

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: apiMessages }),
      });

      if (!response.ok) {
        const errText = await response.text();
        throw new Error(`API error ${response.status}: ${errText}`);
      }
      const data = await response.json();
      if (data.text) {
        setMessages((prev) => [
          ...prev,
          { role: "model", parts: [{ text: data.text }] },
        ]);
      } else {
        throw new Error(data.error || "Failed to get response");
      }
    } catch (error) {
      console.error("Chat error:", error);
      setMessages((prev) => [
        ...prev,
        {
          role: "model",
          parts: [
            {
              text: "Sorry, I'm having trouble connecting right now. Please try again later or contact us at hello@codetunnel.co.in",
            },
          ],
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 font-sans">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.2 }}
            className="mb-4 w-[calc(100vw-3rem)] sm:w-96 h-[520px] bg-zinc-900 border border-zinc-800 rounded-3xl shadow-2xl flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="px-6 py-4 border-b border-zinc-800 flex items-center justify-between bg-zinc-900/50 backdrop-blur-xl">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                  <span className="text-zinc-900 text-[10px] font-black">CT</span>
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white leading-none">
                    Code Tunnel AI
                  </h3>
                  <div className="flex items-center gap-1.5 mt-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[10px] text-zinc-400 font-medium">Online</span>
                  </div>
                </div>
              </div>
              <button
                onClick={toggleChat}
                className="p-1.5 text-zinc-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Messages */}
            <div
              ref={scrollRef}
              className="flex-1 overflow-y-auto p-6 space-y-4 scrollbar-hide"
            >
              {messages.map((msg, i) => {
                const isModel = msg.role === "model";
                return (
                  <div
                    key={i}
                    className={`flex ${isModel ? "justify-start" : "justify-end"}`}
                  >
                    <div
                      className={`max-w-[85%] px-4 py-2.5 text-sm leading-relaxed ${
                        isModel
                          ? "bg-zinc-800 text-zinc-100 rounded-2xl rounded-bl-sm"
                          : "bg-zinc-700 text-white rounded-2xl rounded-br-sm"
                      }`}
                    >
                      {msg.parts[0].text}
                    </div>
                  </div>
                );
              })}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-zinc-800 px-4 py-2.5 rounded-2xl rounded-bl-sm flex gap-1 items-center">
                    <div className="w-1.5 h-1.5 bg-zinc-500 rounded-full animate-bounce [animation-delay:-0.3s]" />
                    <div className="w-1.5 h-1.5 bg-zinc-500 rounded-full animate-bounce [animation-delay:-0.15s]" />
                    <div className="w-1.5 h-1.5 bg-zinc-500 rounded-full animate-bounce" />
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <div className="p-4 border-t border-zinc-800 bg-zinc-900/50">
              <div className="relative flex items-center">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSend()}
                  placeholder="Ask me anything…"
                  disabled={isLoading}
                  className="w-full bg-zinc-800 text-white text-sm px-4 py-3 pr-12 rounded-2xl border border-zinc-700 focus:outline-none focus:border-zinc-500 transition-all placeholder:text-zinc-500 disabled:opacity-50"
                />
                <button
                  onClick={handleSend}
                  disabled={isLoading || !input.trim()}
                  className="absolute right-2 p-2 bg-white text-zinc-900 rounded-xl hover:bg-zinc-200 disabled:opacity-50 disabled:hover:bg-white transition-all"
                >
                  {isLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={toggleChat}
        className="relative group w-14 h-14 bg-zinc-900 border border-zinc-800 rounded-full flex items-center justify-center text-white shadow-2xl hover:scale-110 active:scale-95 transition-all duration-300"
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ opacity: 0, rotate: -90 }}
              animate={{ opacity: 1, rotate: 0 }}
              exit={{ opacity: 0, rotate: 90 }}
            >
              <X className="w-6 h-6" />
            </motion.div>
          ) : (
            <motion.div
              key="open"
              initial={{ opacity: 0, rotate: 90 }}
              animate={{ opacity: 1, rotate: 0 }}
              exit={{ opacity: 0, rotate: -90 }}
            >
              <MessageCircle className="w-6 h-6" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Pulse ring */}
        {!isOpen && (
          <div className="absolute inset-0 bg-zinc-900 rounded-full animate-ping opacity-20 pointer-events-none" />
        )}

        {/* Notification dot */}
        {!hasOpened && !isOpen && (
          <div className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-emerald-500 border-2 border-zinc-900 rounded-full" />
        )}
      </button>
    </div>
  );
}
