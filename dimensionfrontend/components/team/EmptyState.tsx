import type { EmptyStateProps } from "@/app/workspace/team/[slug]/types";

export function EmptyState({ icon: Icon, text }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center gap-2 px-4 py-14 text-center">
      <Icon className="h-6 w-6 text-muted-foreground/60" />
      <p className="text-sm text-muted-foreground">{text}</p>
    </div>
  );
}
