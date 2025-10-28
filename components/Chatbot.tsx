"use client";

import React, { useState, useEffect } from "react";

const Chatbot = () => {
  const [messages, setMessages] = useState<string[]>([]);
  const [input, setInput] = useState("");
  const [websiteData, setWebsiteData] = useState(null);

  // Fetch website data on component mount
  useEffect(() => {
    const fetchWebsiteData = async () => {
      const data = await fetch("/api/getWebsiteData").then((res) => res.json());
      setWebsiteData(data);
    };

    fetchWebsiteData();
    setMessages(["AI Chatbox: Hi! How can I assist you today?"]);
  }, []);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = input;
    setMessages((prev) => [...prev, `You: ${userMessage}`]);
    setInput("");

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: userMessage,
          websiteData, // Pass website data to the server-side API
        }),
      });

      const data = await response.json();
      if (data.botMessage) {
        setMessages((prev) => [...prev, `AI Chatbox: ${data.botMessage}`]);
      }
    } catch (error) {
      console.error("Error with Chatbot API:", error);
      setMessages((prev) => [...prev, "AI Chatbox: Sorry, something went wrong."]);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 bg-white p-4 rounded-lg shadow-lg w-80">
      <div className="h-64 overflow-y-auto mb-4">
        {messages.map((msg, index) => (
          <div key={index} className="mb-2">
            {msg}
          </div>
        ))}
      </div>
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Type your message..."
        className="w-full p-2 border rounded mb-2"
      />
      <button
        onClick={handleSend}
        className="w-full bg-blue-500 text-white p-2 rounded"
      >
        Send
      </button>
    </div>
  );
};

export default Chatbot;