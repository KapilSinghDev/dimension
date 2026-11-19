import type { AvatarStackProps } from "@/app/workspace/team/[slug]/types";
import { UserAvatar } from "./UserAvatar";

export function AvatarStack({ users, max = 4 }: AvatarStackProps) {
  const shown = users.slice(0, max);
  const extra = users.length - shown.length;
  return (
    <div className="flex items-center -space-x-2">
      {shown.map((user) => (
        <UserAvatar
          key={user.user_id}
          user={user}
          className="h-6 w-6 ring-2 ring-background"
        />
      ))}
      {extra > 0 && (
        <span className="z-10 flex h-6 min-w-6 items-center justify-center rounded-full bg-muted px-1 text-[10px] font-medium text-muted-foreground ring-2 ring-background">
          +{extra}
        </span>
      )}
    </div>
  );
}
