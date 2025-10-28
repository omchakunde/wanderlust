"use client";

import React, { useState, useRef, useEffect } from "react";
import Chatbot from "./Chatbot";

const ChatbotWrapper = () => {
  const [isChatbotOpen, setIsChatbotOpen] = useState(false); // State to track chatbot visibility
  const chatbotRef = useRef<HTMLDivElement>(null); // Reference to the chatbot container

  const toggleChatbot = () => {
    setIsChatbotOpen((prev) => !prev); // Toggle the chatbot visibility
  };

  // Close the chatbot when clicking outside of it
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        chatbotRef.current &&
        !chatbotRef.current.contains(event.target as Node)
      ) {
        setIsChatbotOpen(false); // Close the chatbot
      }
    };

    // Add event listener to detect clicks outside
    document.addEventListener("mousedown", handleClickOutside);

    // Cleanup the event listener on component unmount
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div>
      {/* Chatbot Toggle Button */}
      <button
        onClick={toggleChatbot}
        className="fixed bottom-4 right-4 bg-blue-500 text-white p-3 rounded-full shadow-lg"
      >
        {isChatbotOpen ? "Close Chatbot" : "Chatbot"} {/* Dynamic button text */}
      </button>

      {/* Chatbot Component */}
      {isChatbotOpen && (
        <div
          ref={chatbotRef} // Attach the ref to the chatbot container
          className="fixed bottom-16 right-4"
        >
          <Chatbot />
        </div>
      )}
    </div>
  );
};

export default ChatbotWrapper;