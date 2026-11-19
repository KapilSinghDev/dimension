import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { UserAvatarProps } from "@/app/workspace/team/[slug]/types";
import { AVATAR_TONES, fullName, initials } from "./team-utils";

export function UserAvatar({ user, className = "h-6 w-6" }: UserAvatarProps) {
  return (
    <Avatar className={className}>
      {user.picture && <AvatarImage src={user.picture} alt={fullName(user)} />}
      <AvatarFallback
        className={`text-[10px] font-medium ${AVATAR_TONES[user.user_id % AVATAR_TONES.length]}`}
      >
        {initials(user)}
      </AvatarFallback>
    </Avatar>
  );
}
