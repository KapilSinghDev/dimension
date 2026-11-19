import { Card } from "@/components/ui/card";
import type { StatCardProps } from "@/app/workspace/team/[slug]/types";

export function StatCard({ label, value, icon: Icon }: StatCardProps) {
  return (
    <Card className="gap-1 p-4 shadow-none">
      <div className="flex items-center justify-between text-muted-foreground">
        <span className="text-xs font-medium">{label}</span>
        <Icon className="h-4 w-4" />
      </div>
      <span className="text-2xl font-semibold tabular-nums tracking-tight">
        {value}
      </span>
    </Card>
  );
}
