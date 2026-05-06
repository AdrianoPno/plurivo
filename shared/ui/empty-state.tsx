interface EmptyStateProps {
  title: string;
  description?: string;
}

export function EmptyState({ title, description }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-zinc-300 p-8 text-center">
      <h3 className="text-sm font-semibold text-zinc-900">{title}</h3>

      {description && (
        <p className="mt-2 text-sm text-zinc-500">{description}</p>
      )}
    </div>
  );
}
