"use client";
import React, { useState, useRef, useEffect, SetStateAction } from "react";
import * as XLSX from "xlsx";
import { useChat } from "@ai-sdk/react";
import {
  Handshake,
  HeartPulse,
  Loader,
  NotepadText,
  Send,
  Sparkles,
  Users,
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import Image from "next/image";
import { Poppins } from "next/font/google";
import extractJsonFromString from "./get-json";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "700"],
});

export default function Chat( { excelData ,  setExcelData} : { excelData :string , setExcelData : React.Dispatch<SetStateAction<string>>} ) {
  // 1. Set up chat + local state
  const { messages, input, handleInputChange, handleSubmit, status, stop } = useChat();
  
  const [messageTimestamps] = useState(new Map<string, string>());

  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

 
console.log("message " , messages)
  // 3. Submit chat message + Excel data
  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    let updatedInput = input;
    // if (excelData) {
      
    //   updatedInput += \n\nExcel Data: ${JSON.stringify(excelData)};
    //   console.log(updatedInput)
    // }
    // Update the input field with appended Excel data
    handleInputChange({ target: { value: updatedInput  }, } as React.ChangeEvent<HTMLInputElement>);
    try {
       handleSubmit();
    } catch (error) {
      console.error("Error during submission:", error);
    }
  };
  // 4. Focus + Autoscroll
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // 5. Timestamp helper
  const getMessageTime = (messageId: string) => {
    if (!messageTimestamps.has(messageId)) {
      messageTimestamps.set(messageId, new Date().toLocaleTimeString());
    }
    return messageTimestamps.get(messageId);
  };

  // 6. Example suggestions
  const suggestions = [
    {
      icon: <Handshake className="w-4 h-4 mr-2" />,
      text: "Hey Acenra, what's up?",
    },
    {
      icon: <Sparkles className="w-4 h-4 mr-2" />,
      text: "What does Findun Innovations and Technologies do?",
    },
    {
      icon: <Users className="w-4 h-4 mr-2" />,
      text: "Who are the key people in the company?",
    },
    {
      icon: <HeartPulse className="w-4 h-4 mr-2" />,
      text: "Whom should I contact for health concerns?",
    },
    {
      icon: <NotepadText className="w-4 h-4 mr-2" />,
      text: "Can you get my Joining Letter?",
    },
  ];

  const handleSuggestionClick = (text: string) => {
    handleInputChange({
      target: { value: text },
    } as React.ChangeEvent<HTMLInputElement>);
    if (inputRef.current) inputRef.current.focus();
  };
  useEffect(() => {
    if (messages.length > 0) {
      const lastMessage = messages[messages.length - 1];
    const tempJson = excelData
      if (lastMessage.role === "assistant") {
        // Extract JSON if present
        const extractedJson = extractJsonFromString(lastMessage.content , "filebase64");
  
        if (extractedJson) {
          console.log("Extracted JSON Data:", extractedJson);
          setExcelData(extractedJson); // Store extracted data in state
        } else {
          setExcelData(tempJson)
        }
      }
    }
  }, [messages]); // Runs whenever `messages` updates
  

  return (
    <main className={`${poppins.className} bg-black shrink-0 h-screen w-[600px]`}>
      <div className="flex h-full bg-white">
        <div className="flex rounded-lg flex-col items-center shadow-lg justify-center p-6 relative w-full">
          {/* If no messages, show a welcome screen */}
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center flex-1">
            
              <h1 className="text-2xl font-bold text-gray-800 text-center">
                Welcome to Execel Automation
              </h1>
             
              {/* <div className="flex flex-wrap justify-center gap-2 mt-10 text-sm md:text-base">
                {suggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    className="bg-[#FCF9FF] text-black text-[14px] transition-all duration-300 font-medium px-4 py-2 rounded-md hover:bg-[#F4E8FF] shadow flex items-center"
                    onClick={() => handleSuggestionClick(suggestion.text)}
                  >
                    {suggestion.icon}
                    {suggestion.text}
                  </button>
                ))}
              </div> */}
            </div>
          )}

          {/* Chat messages */}
          {messages.length > 0 && (
            <div className="w-full h-[88%] p-4 absolute top-0 justify-start flex flex-col">
              <div className="overflow-y-auto flex-grow">
                {messages.map((message) => (
                  <div key={message.id}>
                    {message.role === "assistant" ? (
                      <div className="w-full text-[14px] mx-auto px-10 flex">
                        <div className="ml-1">
                          <div className="bg-[#EFEEEE] text-gray-800 p-3 rounded-lg relative">
                            <div
                              className="absolute -start-[6px] top-0 w-3 h-10 bg-inherit"
                              style={{ clipPath: "polygon(100% 0, 100% 50%, 0 0)" }}
                            ></div>
                            <ReactMarkdown
                              remarkPlugins={[remarkGfm]}
                              components={{
                                code({ node, className, children, ...props }) {
                                  return (
                                    <pre
                                      {...props}
                                      className="bg-gray-200 p-2 rounded1"
                                      ref={props.ref as React.LegacyRef<HTMLPreElement>}
                                    >
                                      <code>{children}</code>
                                    </pre>
                                  );
                                },
                                ul: ({ children }) => <ul className="list-disc ml-4">{children}</ul>,
                                ol: ({ children }) => <ol className="list-decimal ml-4">{children}</ol>,
                                a: ({ node, ...props }) => (
                                  <a
                                    {...props}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-500"
                                  >
                                    {props.children}
                                  </a>
                                ),
                              }}
                            >
                              {extractJsonFromString(message.content , "content")}
                            </ReactMarkdown>
                          </div>
                          <span className="text-xs text-gray-400 mb-1">
                            {getMessageTime(message.id)}
                          </span>
                        </div>
                      </div>
                    ) : (
                      <div className="w-full mx-auto text-[14px] py-6 justify-end px-10 flex">
                        <div>
                          <div className="bg-[#F5F5F5] p-2 text-gray-800 rounded-lg relative">
                            <div
                              className="absolute -end-[6px] top-0 w-3 h-10 bg-inherit"
                              style={{ clipPath: "polygon(100% 0, 0 0, 0 41%)" }}
                            ></div>
                            <ReactMarkdown
                              remarkPlugins={[remarkGfm]}
                              components={{
                                code({ node, className, children, ...props }) {
                                  return (
                                    <pre
                                      {...props}
                                      className="bg-gray-200 p-2 rounded1"
                                      ref={props.ref as React.LegacyRef<HTMLPreElement>}
                                    >
                                      <code>{children}</code>
                                    </pre>
                                  );
                                },
                                ul: ({ children }) => <ul className="list-disc ml-4">{children}</ul>,
                                ol: ({ children }) => <ol className="list-decimal ml-4">{children}</ol>,
                              }}
                            >
                              {message.content}
                            </ReactMarkdown>
                          </div>
                          <span className="text-xs text-gray-400 mb-1">
                            {getMessageTime(message.id)}
                          </span>
                        </div>
                        <Image
                          alt="user"
                          src="/vercel.svg"
                          width={100}
                          height={100}
                          className="w-10 h-10 object-contain"
                        />
                      </div>
                    )}
                  </div>
                ))}
                <div ref={scrollRef}></div>
              </div>
            </div>
          )}

          {/* File upload + chat input */}
          <div className="w-full flex-col justify-center shadow-md rounded-lg flex items-center absolute bottom-0">
           
            <div className="w-full mb-2 flex-col justify-center rounded-lg flex items-center">
              <form
                className="w-5/6 text-black flex rounded-lg items-center border-[#180047] border-2 bg-[#FFFFFF]"
                onSubmit={submit}
              >
                <input
                  ref={inputRef}
                  className="h-12 rounded-md bg-white px-4 text-sm flex-grow focus:outline-none border-none"
                  placeholder="Send a message"
                  value={input}
                  onChange={handleInputChange}
                />
                <button
                  type="submit"
                  className="bg-[#53108d] p-2 text-white mr-1 rounded-lg hover:bg-[#53108dc0]"
                >
                  <Send className="w-5 h-5" />
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
   
    </main>
  );
}
