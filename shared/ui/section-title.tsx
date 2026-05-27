import { ReactNode } from "react";

interface SectionTitleProps {
  title: string;
  description?: string;
  children?: ReactNode;
}

export function SectionTitle({
  title,
  description,
  children,
}: SectionTitleProps) {
  return (
    <div className="mb-4 flex items-center justify-between gap-4">
      <div>
        <h2 className="text-lg font-semibold text-foreground">{title}</h2>

        {description && (
          <p className="mt-1 text-sm text-muted-foreground">{description}</p>
        )}
      </div>

      {children}
    </div>
  );
}
