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
}

export interface IssueItems {
  issue_id: number;
  title: string;
  created_at: Date;
  created_by: number;
  deadline: Date;
  priority: string;
  status: string;
}

export interface ProjectBatchResponse {
  projects: ProjectApiItem[];
}
