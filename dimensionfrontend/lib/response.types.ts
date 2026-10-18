import {
  issue_status_enum,
  IssueLabel_enums,
  IssuePriority_enums,
  project_health_enum,
  project_priority_enum,
  project_status_enum,
} from "./enums";

export interface userResponseinterface {
  user_id: number;
  firstname: string;
  lastname: string;
  email: string;
  created_at: Date;
  picture?: string | null;
  role?: string | null;
}
export interface ProjectApiItem {
  id: number;
  title: string;
  description: string;
  taget_date: string;
  create_date: string;
  health: "on-track" | "at-risk" | "off-track";
  status: "backlog" | "in-progress" | "completed";
  priority: string;
  issues: IssueItems[];
  created_by?: userResponseinterface;
}

export interface IssueItems {
  issue_id: number;
  title: string;
  created_at: Date;
  created_by: number;
  deadline: Date;
  priority: string;
  status: string;
  project?: ProjectApiItem; //changed;
}

export interface ProjectBatchResponse {
  projects: ProjectApiItem[];
}

export interface UpdatesResponseInterface {
  update_id: number;
  update_time: Date;
  update_comment: string;
  update_asset?: string;
}
export interface IssueResponseInterface {
  issue_id: number;
  title: string;
  description: string;
  label: IssueLabel_enums;
  created_at: Date;
  created_by: number;
  deadline: Date;
  priority: IssuePriority_enums;
  status: issue_status_enum;
  issue_updates: UpdatesResponseInterface[];
}
export interface ProjectOverviewResponse {
  id: number;
  tittle: string;
  description: string;
  create_date: Date;
  taget_date: Date;
  health: project_health_enum;
  status: project_status_enum;
  priority: project_priority_enum;
  issues: IssueResponseInterface[];
  created_by?: userResponseinterface;
}
