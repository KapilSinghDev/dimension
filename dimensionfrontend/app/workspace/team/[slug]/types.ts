import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";

/** Team type interface. */
export interface TeamUser {
  user_id: number;
  firstname: string;
  lastname: string;
  email: string;
  created_at: string;
  picture: string | null;
  role: string | null;
}

/** Team type interface. */
export interface TeamIssue {
  issue_id: number;
  title: string;
  description: string;
  lable: string;
  created_at: string;
  created_by: number;
  deadline: string;
  priority: string;
  status: string;
}

/** Team type interface. */
export interface TeamDetails {
  team_id: string;
  name: string;
  status: "active" | "archived" | string;
  timezone: string | null;
  members: TeamUser[];
  admin: TeamUser | null;
  issue_assigned: TeamIssue[];
}

/** Team type interface. */
export interface TeamResponse {
  response: TeamDetails;
}

/** Team type interface. */
export interface TeamMeta {
  label: string;
  icon: LucideIcon;
  className: string;
}

/** Team type interface. */
export interface TeamTimezoneParts {
  offset: string;
  time: string;
}

/** Team type interface. */
export interface UserAvatarProps {
  user: TeamUser;
  className?: string;
}

/** Team type interface. */
export interface AvatarStackProps {
  users: TeamUser[];
  max?: number;
}

/** Team type interface. */
export interface StatCardProps {
  label: string;
  value: number;
  icon: LucideIcon;
}

/** Team type interface. */
export interface PropertyRowProps {
  label: string;
  children: ReactNode;
}

/** Team type interface. */
export interface EmptyStateProps {
  icon: LucideIcon;
  text: string;
}

/** Team type interface. */
export interface IssueRowProps {
  issue: TeamIssue;
  prefix: string;
  creator?: TeamUser;
}

/** Team type interface. */
export interface MemberRowProps {
  user: TeamUser;
  isAdmin: boolean;
}

/** Team type interface. */
export interface TeamDetailsViewProps {
  team: TeamDetails;
}
