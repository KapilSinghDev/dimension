import { Badge } from "@/components/ui/badge";
import type { MemberRowProps } from "@/app/workspace/team/[slug]/types";
import { UserAvatar } from "./UserAvatar";
import { formatDate, fullName } from "./team-utils";

export function MemberRow({ user, isAdmin }: MemberRowProps) {
  return (
    <li className="flex items-center gap-3 px-4 py-3 transition-colors hover:bg-muted/50">
      <UserAvatar user={user} className="h-8 w-8" />
      <div className="flex min-w-0 flex-1 flex-col">
        <span className="truncate text-sm font-medium">{fullName(user)}</span>
        <span className="truncate text-xs text-muted-foreground">
          {user.email}
        </span>
      </div>
      {isAdmin && (
        <Badge variant="secondary" className="font-normal">
          Admin
        </Badge>
      )}
      <span className="hidden text-xs text-muted-foreground sm:inline">
        Joined {formatDate(user.created_at)}
      </span>
    </li>
  );
}
