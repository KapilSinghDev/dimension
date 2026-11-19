import type { PropertyRowProps } from "@/app/workspace/team/[slug]/types";

export function PropertyRow({ label, children }: PropertyRowProps) {
  return (
    <div className="flex items-center justify-between gap-4 py-2.5">
      <span className="text-sm text-muted-foreground">{label}</span>
      <div className="flex min-w-0 items-center gap-2 text-sm font-medium">
        {children}
      </div>
    </div>
  );
}
