"use client";
import { useState, useRef, useEffect } from "react";

// A utility to format the text from the API response to display bolding.
const formatText = (text) => {
  let formattedText = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  return formattedText;
};

// Main React component for the chat widget.
export default function App({ apiKey }) {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    // Automatically scroll to the latest message whenever messages are updated.
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });

  }, [messages]);

  const handleSend = async () => {
    // Prevent sending empty messages, or sending a new message while a previous one is loading, or if the API key is not ready.
    if (!input.trim() || isLoading || !apiKey) {
      if (!apiKey) {
        setMessages((prev) => [
          ...prev,
          { sender: "bot", text: "Error: No API key found. Please ensure the API key is correctly configured." },
        ]);
      }
      return;
    }

    // Add the user's message to the chat history.
    const userMessage = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);

    // Clear the input field and set the loading state.
    setInput("");
    setIsLoading(true);

    try {
      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey}`;
      
      const systemPrompt = "You are a helpful and friendly AI assistant. Respond to user queries concisely and politely.";
      const payload = {
        contents: [{ parts: [{ text: userMessage.text }] }],
        tools: [{ "google_search": {} }],
        systemInstruction: {
          parts: [{ text: systemPrompt }]
        },
      };

      // Use exponential backoff to handle potential API rate limiting or temporary network issues.
      let response;
      let retries = 0;
      const maxRetries = 5;
      const baseDelay = 1000; // 1 second

      while (retries < maxRetries) {
        try {
          response = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
          });
          if (response.ok) {
            break;
          }
        } catch (networkError) {
          console.warn(`Attempt ${retries + 1} failed. Retrying...`);
        }
        retries++;
        const delay = baseDelay * Math.pow(2, retries - 1);
        if (retries < maxRetries) {
          await new Promise(res => setTimeout(res, delay));
        }
      }

      if (!response || !response.ok) {
          throw new Error(`Final API call failed after ${maxRetries} retries with status: ${response ? response.status : 'No response'}`);
      }

      const data = await response.json();
      
      // Safely extract the AI's reply from the nested JSON structure.
      const candidate = data?.candidates?.[0];
      const reply = candidate?.content?.parts?.[0]?.text || "No response from the AI.";

      // Add the bot's reply to the chat history.
      setMessages((prev) => [...prev, { sender: "bot", text: reply }]);
    } catch (err) {
      console.error("API call failed:", err);
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "Error: Could not connect or get a valid response from the AI." },
      ]);
    } finally {
      // End the loading state.
      setIsLoading(false);
    }
  };

  // Handle the Enter key press for quick sending.
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  return (
    <div className="font-sans text-gray-900 min-h-screen flex items-center justify-center">
      {/* Floating Button to toggle the chat widget. */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 z-50 bg-blue-600 text-white px-5 py-3 rounded-full shadow-lg hover:bg-blue-700 transition font-semibold focus:outline-none focus:ring-4 focus:ring-blue-300"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6 inline-block mr-2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 9.75a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H7.5m2.25 0H9.75m1.5-1.5a.75.75 0 0 0-.75-.75h-7.5a.75.75 0 0 0-.75.75v5.25c0 .414.336.75.75.75h4.5a.75.75 0 0 1 .75.75v1.5c0 .207.168.375.375.375h1.5a.375.375 0 0 0 .375-.375v-1.5a.375.375 0 0 1 .375-.375h1.5a.375.375 0 0 0 .375-.375V6a.75.75 0 0 0-.75-.75h-2.25Zm-3.75-.75V3.75" />
        </svg>
        {open ? 'Close AI' : 'Ask AI'}
      </button>

      {/* Main chat window container */}
      {open && (
        <div className="fixed bottom-20 right-5 w-80 sm:w-96 bg-white shadow-2xl rounded-2xl border border-gray-300 p-4 flex flex-col z-50 max-h-[80vh]">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-800">AI Assistant</h2>
            <button onClick={() => setOpen(false)} className="text-gray-500 hover:text-gray-700 transition">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          {/* Chat messages display area */}
          <div className="flex-1 overflow-y-auto space-y-3 mb-3 pr-2">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`max-w-[85%] break-words px-4 py-2 rounded-2xl shadow-sm ${
                  msg.sender === "user"
                    ? "bg-blue-600 text-white ml-auto"
                    : "bg-gray-200 text-gray-900 mr-auto"
                }`}
                dangerouslySetInnerHTML={{ __html: formatText(msg.text) }}
              />
            ))}
            {/* Loading indicator */}
            {isLoading && (
              <div className="bg-gray-200 text-gray-900 px-4 py-2 rounded-2xl shadow-sm w-fit mr-auto">
                <div className="animate-pulse">...</div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Input field and send button */}
          <div className="flex gap-2">
            <input
              className="flex-1 border border-gray-300 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800 transition duration-200"
              placeholder="Type your message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyPress}
            />
            <button
              onClick={handleSend}
              className={`bg-blue-600 text-white px-5 rounded-xl hover:bg-blue-700 transition font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
              disabled={isLoading}
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.769 59.769 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
