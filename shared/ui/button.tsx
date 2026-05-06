"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";

import { cn } from "../utils/cn";

type ButtonVariant =
  | "default"
  | "primary"
  | "secondary"
  | "ghost"
  | "danger"
  | "outline"
  | "destructive"
  | "link";

type ButtonSize = "default" | "sm" | "lg" | "icon";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  asChild?: boolean;
}

const variants: Record<ButtonVariant, string> = {
  default: "bg-primary text-primary-foreground shadow-sm hover:bg-primary/90",
  primary: "bg-primary text-primary-foreground shadow-sm hover:bg-primary/90",
  secondary:
    "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/85",
  ghost: "text-foreground hover:bg-accent hover:text-accent-foreground",
  danger:
    "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
  destructive:
    "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
  outline:
    "border border-input bg-background text-foreground shadow-sm hover:bg-accent hover:text-accent-foreground",
  link: "h-auto rounded-none px-0 py-0 text-primary underline-offset-4 hover:underline",
};

const sizes: Record<ButtonSize, string> = {
  default: "h-9 px-4 py-2",
  sm: "h-8 rounded-lg px-3 text-xs",
  lg: "h-10 rounded-xl px-5",
  icon: "size-9",
};

export function Button({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  ...props
}: ButtonProps) {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      className={cn(
        "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-medium transition-colors",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        "disabled:pointer-events-none disabled:opacity-50",
        variants[variant],
        sizes[size],
        className,
      )}
      {...props}
    />
  );
}
