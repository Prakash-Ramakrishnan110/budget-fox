import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, Bot, User } from "lucide-react";
import { cn } from "@/lib/utils";
import logo from "@assets/generated_images/minimalist_geometric_fox_logo_for_budgetfox_app.png";

type Message = {
  id: number;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
};

const INITIAL_MESSAGES: Message[] = [
  {
    id: 1,
    text: "Hi Alex! I'm Foxy, your personal finance assistant. 🦊 How can I help you save money today?",
    sender: 'bot',
    timestamp: new Date()
  }
];

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [inputValue, setInputValue] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = () => {
    if (!inputValue.trim()) return;

    const newUserMsg: Message = {
      id: Date.now(),
      text: inputValue,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, newUserMsg]);
    setInputValue("");

    // Simulate AI response
    setTimeout(() => {
      const responses = [
        "That's a great question! Based on your spending, you have ₹1,200 left for food this week.",
        "I noticed you spent a lot on Uber lately. Maybe try the campus bus? 🚌",
        "Your PayLater bill is due in 5 days. Want me to set a reminder?",
        "You're doing great! You saved ₹500 more than last month. 🎉",
        "Be careful with that transaction. It looks a bit unusual."
      ];
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      
      const newBotMsg: Message = {
        id: Date.now() + 1,
        text: randomResponse,
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, newBotMsg]);
    }, 1000);
  };

  return (
    <div className="flex flex-col h-screen pb-20 bg-zinc-50 dark:bg-black">
      {/* Header */}
      <div className="bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 p-4 flex items-center gap-3 sticky top-0 z-10 shadow-sm">
        <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center border-2 border-orange-500 overflow-hidden p-1">
          <img src={logo} alt="Foxy" className="w-full h-full object-contain" />
        </div>
        <div>
          <h1 className="font-bold text-lg font-display">Foxy AI</h1>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <p className="text-xs text-zinc-500">Online & Smart</p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={cn(
              "flex w-full max-w-[80%]",
              msg.sender === 'user' ? "ml-auto justify-end" : "justify-start"
            )}
          >
            <div
              className={cn(
                "p-4 rounded-2xl text-sm leading-relaxed shadow-sm",
                msg.sender === 'user'
                  ? "bg-primary text-primary-foreground rounded-tr-none"
                  : "bg-white dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 rounded-tl-none border border-zinc-100 dark:border-zinc-700"
              )}
            >
              {msg.text}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 bg-white dark:bg-zinc-900 border-t border-zinc-200 dark:border-zinc-800 sticky bottom-20">
        <div className="flex gap-2">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask Foxy anything..."
            className="rounded-full bg-zinc-100 dark:bg-zinc-800 border-0 focus-visible:ring-primary"
          />
          <Button 
            onClick={handleSend} 
            size="icon" 
            className="rounded-full w-10 h-10 shrink-0"
            disabled={!inputValue.trim()}
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
