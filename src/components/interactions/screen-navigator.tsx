"use client";

import { useState, useRef, useEffect, type ReactNode } from "react";
import { cn } from "@/lib/utils";

interface Screen {
  id: string;
  label: string;
  icon?: ReactNode;
}

interface ScreenNavigatorProps {
  screens: Screen[];
  activeScreen: string;
  onScreenChange: (screenId: string) => void;
  variant?: "bottom-tabs" | "top-tabs" | "dots";
  transition?: "slide" | "fade" | "none";
  children: ReactNode;
  className?: string;
}

export function ScreenNavigator({
  screens,
  activeScreen,
  onScreenChange,
  variant = "bottom-tabs",
  transition = "slide",
  children,
  className,
}: ScreenNavigatorProps) {
  const prevScreenRef = useRef(activeScreen);
  const [direction, setDirection] = useState<"left" | "right">("left");
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (prevScreenRef.current !== activeScreen) {
      const prevIndex = screens.findIndex(
        (s) => s.id === prevScreenRef.current
      );
      const nextIndex = screens.findIndex((s) => s.id === activeScreen);
      setDirection(nextIndex > prevIndex ? "left" : "right");
      setIsAnimating(true);
      const timer = setTimeout(() => setIsAnimating(false), 200);
      prevScreenRef.current = activeScreen;
      return () => clearTimeout(timer);
    }
  }, [activeScreen, screens]);

  const transitionClasses =
    transition === "slide"
      ? cn(
          "transition-all duration-200 ease-out",
          isAnimating &&
            (direction === "left"
              ? "animate-slide-in-left"
              : "animate-slide-in-right")
        )
      : transition === "fade"
        ? cn(
            "transition-opacity duration-150 ease-out",
            isAnimating ? "opacity-0" : "opacity-100"
          )
        : "";

  return (
    <div className={cn("flex flex-col h-full relative", className)}>
      {variant === "top-tabs" && (
        <TopTabBar
          screens={screens}
          activeScreen={activeScreen}
          onScreenChange={onScreenChange}
        />
      )}

      <div className={cn("flex-1 overflow-hidden relative", transitionClasses)}>
        {children}
      </div>

      {variant === "bottom-tabs" && (
        <BottomTabBar
          screens={screens}
          activeScreen={activeScreen}
          onScreenChange={onScreenChange}
        />
      )}

      {variant === "dots" && (
        <DotIndicator
          screens={screens}
          activeScreen={activeScreen}
          onScreenChange={onScreenChange}
        />
      )}
    </div>
  );
}

export function BottomTabBar({
  screens,
  activeScreen,
  onScreenChange,
}: {
  screens: Screen[];
  activeScreen: string;
  onScreenChange: (screenId: string) => void;
}) {
  return (
    <div className="flex items-center justify-around border-t border-border/40 bg-background/95 backdrop-blur-sm px-2 py-1.5">
      {screens.map((screen) => {
        const isActive = screen.id === activeScreen;
        return (
          <button
            key={screen.id}
            onClick={() => onScreenChange(screen.id)}
            className={cn(
              "flex flex-col items-center gap-0.5 px-3 py-1 rounded-lg transition-colors duration-150 min-w-0 flex-1",
              isActive
                ? "text-primary"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {screen.icon && (
              <span className={cn("w-5 h-5", isActive && "scale-110 transition-transform duration-150")}>
                {screen.icon}
              </span>
            )}
            <span
              className={cn(
                "text-[10px] leading-tight truncate",
                isActive ? "font-semibold" : "font-medium"
              )}
            >
              {screen.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}

function TopTabBar({
  screens,
  activeScreen,
  onScreenChange,
}: {
  screens: Screen[];
  activeScreen: string;
  onScreenChange: (screenId: string) => void;
}) {
  return (
    <div className="flex items-center border-b border-border/40 bg-background/95 backdrop-blur-sm px-1">
      {screens.map((screen) => {
        const isActive = screen.id === activeScreen;
        return (
          <button
            key={screen.id}
            onClick={() => onScreenChange(screen.id)}
            className={cn(
              "flex items-center gap-1.5 px-3 py-2 text-sm transition-colors duration-150 border-b-2 -mb-px",
              isActive
                ? "border-primary text-primary font-medium"
                : "border-transparent text-muted-foreground hover:text-foreground"
            )}
          >
            {screen.icon && <span className="w-4 h-4">{screen.icon}</span>}
            <span>{screen.label}</span>
          </button>
        );
      })}
    </div>
  );
}

function DotIndicator({
  screens,
  activeScreen,
  onScreenChange,
}: {
  screens: Screen[];
  activeScreen: string;
  onScreenChange: (screenId: string) => void;
}) {
  return (
    <div className="flex items-center justify-center gap-2 py-3">
      {screens.map((screen) => {
        const isActive = screen.id === activeScreen;
        return (
          <button
            key={screen.id}
            onClick={() => onScreenChange(screen.id)}
            className={cn(
              "rounded-full transition-all duration-200",
              isActive
                ? "w-2.5 h-2.5 bg-primary"
                : "w-2 h-2 bg-muted-foreground/30 hover:bg-muted-foreground/50"
            )}
            aria-label={screen.label}
          />
        );
      })}
    </div>
  );
}
