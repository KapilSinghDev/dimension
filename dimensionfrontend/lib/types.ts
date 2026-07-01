import {
  issue_status_enum,
  priority_enum,
  project_health_enum,
  project_priority_enum,
  project_status_enum,
} from "./enums";

export type userCredentials_type = {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
};

export type userSignup_type = userCredentials_type & {
  role: string;
  organisation: string;
  team: string;
  issue: number[];
};

export type userLogin_type = {
  email: string;
  password: string;
};

export type userProfile_type = {
  role: string;
  organisation: string;
  team: string;
  issue: string[];
};

export type userSearch_type = {
  email: string;
};

export type userUpdateProfile_type = {
  user_email: string;
  role?: string;
  organisation?: string;
};

export type issue_type = {
  issue_id: number;
  title: string;
  created_at: Date;
  created_by: number;
  assignee: string;
  team: string;
  deadline: Date;
  priority: priority_enum;
  status: issue_status_enum;
};

export type issueCreate_type = {
  title: string;
  created_by: number;
  assignee?: string;
  team?: string;
  deadline: Date;
  priority: priority_enum;
  status: issue_status_enum;
  target: string;
};

export type project_type = {
  title: string;
  description?: string;
  target_date?: Date;
  health?: project_health_enum;
  priority?: project_priority_enum;
  status?: project_status_enum;
  issue?: issueCreate_type[] | null;
};

export type team_dto_type = {
  team_id: number;
  name: string;
  members: userProfile_type[];
  issue_assigned: issue_type[];
};
export type create_team_dto_type = {
  name: string;
  members: string[];
  issues: number[];
};
