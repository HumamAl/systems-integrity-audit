"use client";

import { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

interface TypingSimulatorProps {
  text: string;
  speed?: number;
  delay?: number;
  onComplete?: () => void;
  cursor?: boolean;
  className?: string;
}

export function TypingSimulator({
  text,
  speed = 40,
  delay = 0,
  onComplete,
  cursor = true,
  className,
}: TypingSimulatorProps) {
  const [displayedText, setDisplayedText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const onCompleteRef = useRef(onComplete);

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    const delayTimer = setTimeout(() => {
      setHasStarted(true);
      setIsTyping(true);
    }, delay);

    return () => clearTimeout(delayTimer);
  }, [delay]);

  useEffect(() => {
    if (!hasStarted) return;

    let charIndex = 0;
    setDisplayedText("");

    const interval = setInterval(() => {
      charIndex++;
      if (charIndex <= text.length) {
        setDisplayedText(text.slice(0, charIndex));
      } else {
        clearInterval(interval);
        setIsTyping(false);
        onCompleteRef.current?.();
      }
    }, speed);

    return () => clearInterval(interval);
  }, [hasStarted, text, speed]);

  return (
    <span className={className}>
      {displayedText}
      {cursor && (hasStarted || delay === 0) && (
        <span
          className="typing-cursor inline-block w-[2px] h-[1em] bg-current ml-0.5 align-text-bottom"
          style={{
            animation: isTyping
              ? "none"
              : "cursor-blink 1s step-end infinite",
          }}
        />
      )}
    </span>
  );
}

interface ChatMessageProps {
  message: string;
  sender: "user" | "bot";
  avatar?: string;
  delay?: number;
  typingDuration?: number;
}

export function ChatMessage({
  message,
  sender,
  avatar,
  delay = 0,
  typingDuration = 1500,
}: ChatMessageProps) {
  const [phase, setPhase] = useState<"waiting" | "typing" | "revealed">(
    "waiting"
  );

  useEffect(() => {
    const delayTimer = setTimeout(() => {
      if (sender === "bot") {
        setPhase("typing");
        const typingTimer = setTimeout(() => {
          setPhase("revealed");
        }, typingDuration);
        return () => clearTimeout(typingTimer);
      } else {
        setPhase("revealed");
      }
    }, delay);

    return () => clearTimeout(delayTimer);
  }, [delay, sender, typingDuration]);

  if (phase === "waiting") return null;

  const isUser = sender === "user";

  return (
    <div
      className={cn(
        "flex gap-2 max-w-[85%]",
        isUser ? "ml-auto flex-row-reverse" : "mr-auto"
      )}
    >
      {avatar && (
        <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-xs font-medium shrink-0 overflow-hidden">
          {avatar.length <= 2 ? (
            avatar
          ) : (
            <img
              src={avatar}
              alt=""
              className="w-full h-full object-cover"
            />
          )}
        </div>
      )}
      <div
        className={cn(
          "rounded-2xl px-4 py-2.5 text-sm leading-relaxed",
          isUser
            ? "bg-primary text-primary-foreground rounded-br-md"
            : "bg-muted text-foreground rounded-bl-md"
        )}
      >
        {phase === "typing" ? <TypingIndicator /> : message}
      </div>
    </div>
  );
}

export function TypingIndicator() {
  return (
    <>
      <span className="flex items-center gap-1 py-1 px-1" aria-label="Typing">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="typing-dot w-1.5 h-1.5 bg-muted-foreground/50 rounded-full"
            style={{ animationDelay: `${i * 160}ms` }}
          />
        ))}
      </span>
      <style>{`
        @keyframes typing-bounce {
          0%, 60%, 100% { transform: translateY(0); }
          30% { transform: translateY(-4px); }
        }
        @keyframes cursor-blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
        .typing-dot {
          animation: typing-bounce 1.4s ease-in-out infinite;
        }
      `}</style>
    </>
  );
}
