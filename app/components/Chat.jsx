"use client";

import { push, set, serverTimestamp } from "firebase/database";
import { useState, useEffect, useRef } from "react";
import { useObject } from "react-firebase-hooks/database";
import { databaseRef } from "../firebase/config";

const Chat = () => {
  const [currentUser, setCurrentUser] = useState();
  const [messages, setMessages] = useState({});
  const [inputMessage, setInputMessage] = useState("");

  // Check if Use Exists, or Create new User
  useEffect(() => {
    const localUser = localStorage.getItem("userUID");
    if (!localUser) {
      const newUser = "User-" + Date.now().toString().substring(9);
      localStorage.setItem("userUID", newUser);
      setCurrentUser(newUser);
    } else {
      setCurrentUser(localUser);
    }
  }, []);

  /* To Get the Database Data with the Key */
  const [snapshots, loading, error] = useObject(databaseRef);

  /* Using useEffect to set the data when ever data Updates. But need to filter the data, cause if null or undefined returned, it will show error. That's why destructuring... We need copy of data, not the state */
  useEffect(() => {
    if (snapshots) {
      setMessages({ ...snapshots.val() });
    } else {
      setMessages({});
    }
  }, [snapshots]);

  const handleSendMessage = (e) => {
    e.preventDefault();

    const newMessage = {
      uid: currentUser,
      message: inputMessage.trim(),
      createdAt: serverTimestamp(),
    };

    const newRef = push(databaseRef);
    set(newRef, newMessage);
    setInputMessage("");
  };

  const chatContainerRef = useRef(null);
  useEffect(() => {
    // Scroll to the end when new messages are added

    chatContainerRef.current.scrollTo({
      top: chatContainerRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="bg-gray-800 text-white p-4 m-5 rounded-md w-full max-w-md h-[calc(100vh-100px)] sm:h-[calc(100vh-50px)] flex flex-col overflow-hidden">
        <h1 className="text-2xl font-bold mb-4">Chat Room 2.0</h1>

        <div
          className="flex-1 overflow-y-auto p-4 bg-gray-700 rounded-md no-scrollbar"
          ref={chatContainerRef}
        >
          {Object.entries(messages).map(([id, data]) => (
            <div
              key={id}
              className={`flex ${
                data.uid === currentUser ? "justify-end" : "justify-start"
              } mb-2`}
            >
              <div
                className={`bg-gray-600 p-2 rounded-lg ${
                  data.user === currentUser ? "text-right" : "text-left"
                }`}
              >
                <p className="text-sm">{data.message}</p>
                <p className="text-xs text-gray-500 mt-1">{`${
                  data.uid
                } • ${new Date(data.createdAt).toLocaleTimeString()}`}</p>
              </div>
            </div>
          ))}
        </div>

        <form className="flex items-center mt-4" onSubmit={handleSendMessage}>
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 p-2 rounded-l-md border border-gray-700 bg-gray-700 outline-none focus:border-[dodgerBlue] w-3/4 sm:w-auto"
          />
          <button
            className={`bg-blue-500 px-4 py-2 rounded-r-md border border-blue-500 ${
              !currentUser || inputMessage.trim().length === 0
                ? "cursor-not-allowed"
                : "hover:bg-blue-600 hover:border-blue-600"
            }`}
            disabled={!currentUser || inputMessage.trim().length === 0}
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
};

export default Chat;
