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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div
        className={cn(
          "w-full max-w-lg rounded-xl bg-white p-6 shadow-xl",
          className,
        )}
      >
        <div className="mb-4 flex items-center justify-between">
          {title && (
            <h2 className="text-lg font-semibold text-zinc-900">{title}</h2>
          )}

          <button
            onClick={onClose}
            className="text-sm text-zinc-500 transition hover:text-zinc-900"
          >
            Fechar
          </button>
        </div>

        <div>{children}</div>
      </div>
    </div>
  );
}
