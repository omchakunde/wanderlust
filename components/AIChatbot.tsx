"use client";

import { useEffect, useRef, useState } from "react";

export default function AIChatbot() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<string[]>([]);

  // Reference for auto-scroll
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Auto scroll when new message comes
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMsg = input;

    // Add user message
    setMessages((prev) => [...prev, "You: " + userMsg]);
    setInput("");

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: userMsg }),
      });

      const data = await res.json();

      // Add bot reply
      setMessages((prev) => [
        ...prev,
        "Bot: " + (data.reply || "Sorry, something went wrong."),
      ]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        "Bot: Server error. Please try again.",
      ]);
    }
  };

  return (
    <>
      {/* Open Button */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 bg-rose-500 text-white p-3 rounded-full shadow-lg z-50"
      >
        💬
      </button>

      {/* Chat Box */}
      {open && (
        <div className="fixed bottom-20 right-6 w-80 h-[420px] bg-white rounded-xl shadow-xl border z-50 flex flex-col">
          
          {/* Header */}
          <div className="p-3 font-semibold border-b">
            AI Assistant
          </div>

          {/* Messages Area (Scrollable) */}
          <div
            className="flex-1 p-3 text-sm space-y-2 overflow-y-auto"
            
          >
            {messages.map((msg, i) => (
              <div
                key={i}
                className={
                  msg.startsWith("You:")
                    ? "text-right bg-blue-100 p-2 rounded"
                    : "text-left bg-gray-100 p-2 rounded"
                }
              >
                {msg}
              </div>
            ))}

            {/* Auto scroll anchor */}
            <div ref={messagesEndRef}></div>
          </div>

          {/* Input Area */}
          <div className="p-2 border-t flex gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              className="flex-1 border rounded px-2 py-1 text-sm focus:outline-none"
              placeholder="Ask something..."
            />

            <button
              onClick={sendMessage}
              className="bg-rose-500 text-white px-3 rounded"
            >
              Send
            </button>
          </div>
        </div>
      )}
    </>
  );
}
