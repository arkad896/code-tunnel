"use client";

import { useState, useEffect, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import { Send, MessageSquare } from "lucide-react";

interface MessagesShellProps {
  messages: any[];
  project: any | null;
  clientId: string;
}

function formatTime(dateStr: string) {
  return new Date(dateStr).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

export default function MessagesShell({
  messages: initialMessages,
  project,
  clientId,
}: MessagesShellProps) {
  const supabase = createClient();
  const [messages, setMessages] = useState(initialMessages);
  const [content, setContent] = useState("");
  const [sending, setSending] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-scroll to bottom
  function scrollToBottom() {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Realtime subscription
  useEffect(() => {
    if (!project) return;

    const channel = supabase
      .channel(`messages:${project.id}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `project_id=eq.${project.id}`,
        },
        (payload) => {
          const newMsg = payload.new as any;
          // Only add if not already in the list (avoid duplicates from optimistic update)
          setMessages((prev) => {
            if (prev.some((m) => m.id === newMsg.id)) return prev;
            return [...prev, newMsg];
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [project, supabase]);

  async function handleSend() {
    if (!project || !content.trim()) return;
    setSending(true);

    const optimisticMsg = {
      id: `temp-${Date.now()}`,
      project_id: project.id,
      sender_role: "client",
      content: content.trim(),
      created_at: new Date().toISOString(),
      read_at: null,
    };

    setMessages((prev) => [...prev, optimisticMsg]);
    setContent("");

    try {
      const res = await fetch("/api/client/message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          project_id: project.id,
          content: optimisticMsg.content,
        }),
      });

      if (!res.ok) {
        console.error("Message error:", await res.json());
        // Remove optimistic message on failure
        setMessages((prev) => prev.filter((m) => m.id !== optimisticMsg.id));
        return;
      }

      const { data } = await res.json();
      if (data) {
        // Replace optimistic message with real one
        setMessages((prev) =>
          prev.map((m) => (m.id === optimisticMsg.id ? data : m))
        );
      }
    } catch (err) {
      console.error(err);
      setMessages((prev) => prev.filter((m) => m.id !== optimisticMsg.id));
    } finally {
      setSending(false);
      textareaRef.current?.focus();
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  if (!project) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="text-center">
          <MessageSquare className="w-10 h-10 text-zinc-300 mx-auto mb-4" />
          <p className="text-zinc-400 text-sm">
            No project found. Messages will appear once a project is assigned.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)]">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-zinc-200 p-4 mb-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-zinc-900 rounded-xl flex items-center justify-center">
            <MessageSquare className="w-4 h-4 text-white" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-zinc-900">
              {project.name}
            </h2>
            <p className="text-xs text-zinc-400">Messages</p>
          </div>
        </div>
      </div>

      {/* Messages area */}
      <div
        ref={scrollRef}
        className="flex-1 bg-white rounded-2xl border border-zinc-200 p-6 overflow-y-auto space-y-4"
      >
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <MessageSquare className="w-10 h-10 text-zinc-200 mx-auto mb-4" />
              <p className="text-zinc-400 text-sm">
                No messages yet. Send your first message below.
              </p>
            </div>
          </div>
        ) : (
          messages.map((msg, i) => {
            const isClient = msg.sender_role === "client";
            const showLabel =
              i === 0 || messages[i - 1]?.sender_role !== msg.sender_role;

            return (
              <div
                key={msg.id}
                className={`flex flex-col ${
                  isClient ? "items-end" : "items-start"
                }`}
              >
                {showLabel && (
                  <span className="text-[10px] font-semibold uppercase tracking-widest text-zinc-400 mb-1 px-1">
                    {isClient ? "You" : "Admin"}
                  </span>
                )}
                <div
                  className={`max-w-[75%] px-4 py-2.5 rounded-2xl ${
                    isClient
                      ? "bg-zinc-900 text-white rounded-br-md"
                      : "bg-zinc-100 text-zinc-900 rounded-bl-md"
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap leading-relaxed">
                    {msg.content}
                  </p>
                  <p
                    className={`text-[10px] mt-1.5 ${
                      isClient ? "text-zinc-400" : "text-zinc-400"
                    }`}
                  >
                    {formatTime(msg.created_at)}
                  </p>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Input area */}
      <div className="bg-white rounded-2xl border border-zinc-200 p-3 mt-4">
        <div className="flex items-end gap-3">
          <textarea
            ref={textareaRef}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a message…"
            rows={2}
            className="flex-1 px-4 py-2.5 text-sm border border-zinc-200 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-400 transition-all placeholder:text-zinc-300 focus:rows-4"
          />
          <button
            onClick={handleSend}
            disabled={sending || !content.trim()}
            className="flex-shrink-0 w-10 h-10 bg-zinc-900 text-white rounded-xl flex items-center justify-center hover:bg-zinc-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
        <p className="text-[10px] text-zinc-400 mt-2 px-1">
          Press Enter to send · Shift+Enter for new line
        </p>
      </div>
    </div>
  );
}
