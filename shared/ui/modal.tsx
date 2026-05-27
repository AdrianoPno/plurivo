"use client";

import { ReactNode } from "react";
import { cn } from "../utils/cn";

interface ModalProps {
  open: boolean;
  title?: string;
  children: ReactNode;
  onClose: () => void;
  className?: string;
}

export function Modal({
  open,
  title,
  children,
  onClose,
  className,
}: ModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/50 p-4">
      <div
        className={cn(
          "w-full max-w-lg rounded-2xl border border-border bg-card p-6 text-card-foreground shadow-xl",
          className,
        )}
      >
        <div className="mb-4 flex items-center justify-between">
          {title && (
            <h2 className="text-lg font-semibold text-card-foreground">
              {title}
            </h2>
          )}

          <button
            onClick={onClose}
            className="text-sm text-muted-foreground transition hover:text-foreground"
          >
            Fechar
          </button>
        </div>

        <div>{children}</div>
      </div>
    </div>
  );
}
