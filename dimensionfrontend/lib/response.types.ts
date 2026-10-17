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
  created_by?: {
    user_id: number;
    firstname: string;
    lastname: string;
    email: string;
    created_at: string;
    picture: string | null;
    role: string | null;
  };
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
