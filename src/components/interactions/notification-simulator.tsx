"use client";

import { useState, useEffect, useRef, type ReactNode } from "react";
import { cn } from "@/lib/utils";

interface Notification {
  id: string;
  title: string;
  body: string;
  icon?: ReactNode;
  time?: string;
}

interface NotificationSimulatorProps {
  notifications: Notification[];
  interval?: number;
  duration?: number;
  position?: "top" | "bottom";
  className?: string;
}

export function NotificationSimulator({
  notifications,
  interval = 5000,
  duration = 3000,
  position = "top",
  className,
}: NotificationSimulatorProps) {
  const [activeNotification, setActiveNotification] =
    useState<Notification | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const indexRef = useRef(0);

  useEffect(() => {
    if (notifications.length === 0) return;

    let cancelled = false;
    const timers: ReturnType<typeof setTimeout>[] = [];

    function scheduleNext(delayMs: number) {
      const timer = setTimeout(() => {
        if (cancelled) return;

        const notification =
          notifications[indexRef.current % notifications.length];
        setActiveNotification(notification);
        setIsVisible(true);

        // Hide after duration
        const hideTimer = setTimeout(() => {
          if (cancelled) return;
          setIsVisible(false);
          indexRef.current++;

          // Schedule next after gap
          scheduleNext(interval);
        }, duration);
        timers.push(hideTimer);
      }, delayMs);
      timers.push(timer);
    }

    // Start first notification after 1s initial delay
    scheduleNext(1000);

    return () => {
      cancelled = true;
      timers.forEach(clearTimeout);
    };
  }, [notifications, interval, duration]);

  if (!activeNotification) return null;

  return (
    <div
      className={cn(
        "absolute left-2 right-2 z-50 pointer-events-none",
        position === "top" ? "top-2" : "bottom-2",
        className
      )}
    >
      <div
        className={cn(
          "mx-auto max-w-sm rounded-2xl border border-border/30 bg-background/80 backdrop-blur-xl px-4 py-3 shadow-lg transition-all duration-200 ease-out pointer-events-auto",
          isVisible
            ? "opacity-100 translate-y-0"
            : cn(
                "opacity-0",
                position === "top" ? "-translate-y-3" : "translate-y-3"
              )
        )}
      >
        <div className="flex items-start gap-3">
          {activeNotification.icon && (
            <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 text-primary">
              {activeNotification.icon}
            </div>
          )}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2">
              <p className="text-sm font-semibold truncate">
                {activeNotification.title}
              </p>
              {activeNotification.time && (
                <span className="text-[10px] text-muted-foreground shrink-0">
                  {activeNotification.time}
                </span>
              )}
            </div>
            <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
              {activeNotification.body}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
