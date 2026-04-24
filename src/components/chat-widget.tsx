"use client";

import { useEffect, useRef, useState } from "react";
import { MessageCircle, X, Send, User } from "lucide-react";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { firebaseDb } from "@/lib/firebase-client";
import { createChatSession, sendChatMessage } from "@/lib/cms";
import type { ChatMessage } from "@/types/cms";

const NOTIFICATION_SOUND = "https://assets.mixkit.co/active_storage/sfx/2354/2354-preview.mp3";

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [text, setText] = useState("");
  const [userName, setUserName] = useState<string | null>(null);
  const [step, setStep] = useState<"initial" | "asking_name" | "chatting">("initial");
  const [hasNewMessage, setHasNewMessage] = useState(false);
  
  const scrollRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Persistence
  useEffect(() => {
    const savedId = localStorage.getItem("radio_chat_session");
    const savedName = localStorage.getItem("radio_chat_name");
    const savedStep = localStorage.getItem("radio_chat_step") as any;

    if (savedId) setSessionId(savedId);
    if (savedName) setUserName(savedName);
    if (savedStep) setStep(savedStep);
    
    if (typeof window !== "undefined") {
      audioRef.current = new Audio(NOTIFICATION_SOUND);
    }
  }, []);

  useEffect(() => {
    if (!sessionId || !firebaseDb) return;
    
    const q = query(
      collection(firebaseDb, "chats", sessionId, "messages"),
      orderBy("createdAt", "asc")
    );

    const unsubscribe = onSnapshot(q, (snap) => {
      const newMessages = snap.docs.map(d => ({ id: d.id, ...d.data() } as ChatMessage));
      
      if (newMessages.length > messages.length && messages.length > 0) {
        const last = newMessages[newMessages.length - 1];
        if (last.sender === "admin") {
          audioRef.current?.play().catch(() => {});
          if (!isOpen) setHasNewMessage(true);
        }
      }
      
      setMessages(newMessages);
    });

    return () => unsubscribe();
  }, [sessionId, messages.length, isOpen]);

  useEffect(() => {
    if (isOpen) setHasNewMessage(false);
  }, [isOpen]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  async function handleSend(e: React.FormEvent) {
    e.preventDefault();
    if (!text.trim()) return;

    let currentSessionId = sessionId;
    if (!currentSessionId) {
      currentSessionId = await createChatSession();
      setSessionId(currentSessionId);
      localStorage.setItem("radio_chat_session", currentSessionId);
    }

    const userText = text;
    setText("");

    if (step === "initial") {
      await sendChatMessage(currentSessionId, userText, "user");
      setStep("asking_name");
      localStorage.setItem("radio_chat_step", "asking_name");
      setTimeout(async () => {
        await sendChatMessage(currentSessionId!, "Hola, ¿cuál es tu nombre?", "admin");
      }, 1000);
    } else if (step === "asking_name") {
      const name = userText.trim();
      setUserName(name);
      localStorage.setItem("radio_chat_name", name);
      await sendChatMessage(currentSessionId, userText, "user", name);
      setStep("chatting");
      localStorage.setItem("radio_chat_step", "chatting");
      setTimeout(async () => {
        await sendChatMessage(currentSessionId!, `Gracias ${name}, en unos minutos un asesor se comunicará contigo.`, "admin");
      }, 1000);
    } else {
      await sendChatMessage(currentSessionId, userText, "user", userName || undefined);
    }
  }

  return (
    <div className="fixed bottom-6 right-6 z-[60] flex flex-col items-end">
      {isOpen ? (
        <div className="mb-4 flex h-[500px] w-[350px] flex-col overflow-hidden rounded-2xl bg-white shadow-2xl shadow-black/20 border border-zinc-100 animate-in slide-in-from-bottom-4 duration-300">
          {/* Header */}
          <div className="flex items-center justify-between bg-brand-night p-4 text-white">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-accent text-brand-night">
                <MessageCircle size={18} />
              </div>
              <div>
                <p className="text-sm font-bold">Chat en Vivo</p>
                <div className="flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
                  <p className="text-[10px] text-white/60">Asesores en línea</p>
                </div>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="rounded-full p-1 hover:bg-white/10 transition">
              <X size={20} />
            </button>
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto bg-zinc-50 p-4 space-y-4">
            {messages.length === 0 && (
              <div className="flex h-full flex-col items-center justify-center text-center p-6">
                <div className="mb-4 rounded-full bg-brand-accent/10 p-4 text-brand-accent">
                  <MessageCircle size={32} />
                </div>
                <p className="text-sm font-bold text-zinc-800">¡Hola!</p>
                <p className="mt-1 text-xs text-zinc-500 text-pretty">
                  Escríbenos y un asesor te atenderá pronto.
                </p>
              </div>
            )}
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm shadow-sm ${
                    msg.sender === "user"
                      ? "bg-brand-night text-white rounded-tr-none"
                      : "bg-white text-zinc-800 border border-zinc-100 rounded-tl-none"
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
          </div>

          {/* Input */}
          <form onSubmit={handleSend} className="border-t border-zinc-100 bg-white p-4">
            <div className="flex items-center gap-2 rounded-xl bg-zinc-100 px-3 py-2 focus-within:ring-2 focus-within:ring-brand-accent/50 transition">
              <input
                type="text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Escribe un mensaje..."
                className="flex-1 bg-transparent text-sm outline-none text-zinc-800"
              />
              <button
                type="submit"
                disabled={!text.trim()}
                className="rounded-lg bg-brand-accent p-2 text-brand-night transition hover:scale-105 active:scale-95 disabled:opacity-50 disabled:hover:scale-100"
              >
                <Send size={16} />
              </button>
            </div>
            <p className="mt-2 text-center text-[10px] text-zinc-400">
              Desarrollado por Freedom Labs
            </p>
          </form>
        </div>
      ) : (
        <button
          onClick={() => setIsOpen(true)}
          className={`group flex h-14 w-14 items-center justify-center rounded-full bg-brand-night text-brand-accent shadow-xl transition hover:scale-110 active:scale-95 ${hasNewMessage ? 'animate-bounce' : ''}`}
        >
          <div className="relative">
            <MessageCircle size={28} />
            {hasNewMessage && (
              <span className="absolute -right-1 -top-1 h-3 w-3 rounded-full bg-red-500 border-2 border-brand-night animate-pulse" />
            )}
          </div>
          <div className="absolute right-16 hidden whitespace-nowrap rounded-lg bg-white px-3 py-1.5 text-xs font-bold text-zinc-800 shadow-lg group-hover:block animate-in fade-in slide-in-from-right-2">
            {hasNewMessage ? "¡Nuevo mensaje!" : "¿Necesitas ayuda?"}
          </div>
        </button>
      )}
    </div>
  );
}
