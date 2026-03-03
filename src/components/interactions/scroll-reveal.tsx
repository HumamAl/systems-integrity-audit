"use client";

import {
  useRef,
  useEffect,
  useState,
  Children,
  cloneElement,
  isValidElement,
  type ReactNode,
} from "react";
import { cn } from "@/lib/utils";

interface ScrollRevealProps {
  children: ReactNode;
  delay?: number;
  direction?: "up" | "down" | "left" | "right" | "none";
  duration?: number;
  className?: string;
}

const directionStyles = {
  up: { initial: "translate-y-4", revealed: "translate-y-0" },
  down: { initial: "-translate-y-4", revealed: "translate-y-0" },
  left: { initial: "translate-x-4", revealed: "translate-x-0" },
  right: { initial: "-translate-x-4", revealed: "translate-x-0" },
  none: { initial: "", revealed: "" },
};

export function ScrollReveal({
  children,
  delay = 0,
  direction = "up",
  duration = 500,
  className,
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isRevealed, setIsRevealed] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (delay > 0) {
            const timer = setTimeout(() => setIsRevealed(true), delay);
            observer.unobserve(element);
            return () => clearTimeout(timer);
          }
          setIsRevealed(true);
          observer.unobserve(element);
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [delay]);

  const { initial, revealed } = directionStyles[direction];

  return (
    <div
      ref={ref}
      className={cn(
        "transition-all ease-out",
        isRevealed ? cn("opacity-100", revealed) : cn("opacity-0", initial),
        className
      )}
      style={{ transitionDuration: `${duration}ms` }}
    >
      {children}
    </div>
  );
}

interface StaggeredListProps {
  children: ReactNode;
  staggerMs?: number;
  direction?: "up" | "down" | "left" | "right" | "none";
  duration?: number;
  className?: string;
}

export function StaggeredList({
  children,
  staggerMs = 80,
  direction = "up",
  duration = 500,
  className,
}: StaggeredListProps) {
  const childArray = Children.toArray(children);

  return (
    <div className={className}>
      {childArray.map((child, index) => (
        <ScrollReveal
          key={isValidElement(child) ? (child.key ?? index) : index}
          delay={index * staggerMs}
          direction={direction}
          duration={duration}
        >
          {child}
        </ScrollReveal>
      ))}
    </div>
  );
}
