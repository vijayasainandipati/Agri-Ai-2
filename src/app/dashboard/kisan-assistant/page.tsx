
"use client";

import React, { useState, useRef, useEffect, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Bot, Loader2, Mic, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { kisanVoiceAssistant } from "@/lib/actions";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/context/language-context";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function KisanAssistantPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [isPending, startTransition] = useTransition();
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const { language, translate } = useLanguage();

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({
        top: scrollAreaRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isPending) return;

    const newMessages: Message[] = [...messages, { role: "user", content: input }];
    setMessages(newMessages);
    setInput("");

    const formData = new FormData();
    formData.append("question", input);
    formData.append("language", language); // From language context
    formData.append("location", "Nagercoil"); // From user profile or geolocation

    startTransition(async () => {
      try {
        const result = await kisanVoiceAssistant(formData);
        const assistantMessage = `${result.answer}${result.suggestedCrops ? `\n\n**${translate('kisanAssistant.suggestedCrops')}:**\n${result.suggestedCrops}`: ''}`;
        setMessages([...newMessages, { role: "assistant", content: assistantMessage }]);
      } catch (error) {
        console.error("Error with Kisan Assistant:", error);
        toast({ title: translate("toast.genericError.title"), description: translate("toast.kisanAssistantError.description"), variant: "destructive" });
        setMessages(newMessages); // Revert to messages before assistant's turn
      }
    });
  };

  const handleVoiceInput = () => {
    // Web Speech API logic
    toast({ title: translate("toast.comingSoon.title"), description: translate("toast.comingSoon.description") });
  };

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col">
      <div className="mb-4">
        <h1 className="text-3xl font-bold font-headline tracking-tight">{translate("kisanAssistant.title")}</h1>
        <p className="text-muted-foreground">
          {translate("kisanAssistant.description")}
        </p>
      </div>

      <div className="flex-1 flex flex-col bg-card border rounded-lg overflow-hidden">
        <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
          <div className="space-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={cn(
                  "flex items-start gap-3",
                  message.role === "user" ? "justify-end" : "justify-start"
                )}
              >
                {message.role === "assistant" && (
                  <Avatar className="h-8 w-8">
                    <AvatarFallback><Bot size={20} /></AvatarFallback>
                  </Avatar>
                )}
                <div
                  className={cn(
                    "p-3 rounded-lg max-w-lg whitespace-pre-wrap",
                    message.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted"
                  )}
                  dangerouslySetInnerHTML={{ __html: message.content.replace(/\n/g, '<br />').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }}
                />
                {message.role === "user" && (
                   <Avatar className="h-8 w-8">
                    <AvatarFallback><User size={20} /></AvatarFallback>
                  </Avatar>
                )}
              </div>
            ))}
             {isPending && (
                <div className="flex items-start gap-3 justify-start">
                    <Avatar className="h-8 w-8">
                        <AvatarFallback><Bot size={20} /></AvatarFallback>
                    </Avatar>
                    <div className="p-3 rounded-lg bg-muted">
                        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                    </div>
                </div>
            )}
          </div>
        </ScrollArea>
        <div className="p-4 border-t bg-background">
          <div className="flex items-center gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder={translate("kisanAssistant.placeholder")}
              disabled={isPending}
            />
            <Button
              variant="outline"
              size="icon"
              onClick={handleVoiceInput}
              disabled={isPending}
            >
              <Mic className="h-4 w-4" />
            </Button>
            <Button onClick={handleSend} disabled={isPending}>{translate("kisanAssistant.send")}</Button>
          </div>
        </div>
      </div>
    </div>
  );
}

    