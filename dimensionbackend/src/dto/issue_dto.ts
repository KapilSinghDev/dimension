import * as z from "zod";
import { issue_status_enum, priority_enum } from "../../enums";
import { team_dto_type } from "./team_dto";
import { user_dto_type, user_profile_dto_type } from "./user_dto";
const issue_dto = z.object({
  issue_id: z.number(),
  title: z.string(),
  created_at: z.date(),
  created_by: z.number(),
  assignee: z.custom<user_profile_dto_type>(),
  team: z.custom<team_dto_type>(),
  deadline: z.coerce.date(),
  priority: z.nativeEnum(priority_enum),
  status: z.nativeEnum(issue_status_enum),
});
// type issue_dto_type = z.infer<typeof issue_dto>;
export type issue_dto_type = {
  issue_id: number;
  title: string;
  created_at: Date;
  created_by: number;
  assignee: user_profile_dto_type;
  team: team_dto_type;
  deadline: Date;
  priority: priority_enum;
  status: issue_status_enum;
};
export const create_issue_dto = z.object({
  title: z.string(),
  created_by: z.number(),
  //  assignee: z.custom<user_profile_dto_type>().optional(),
  //  team: z.custom<team_dto_type>().optional(),
  assignee: z.email().optional(),
  team: z.string().optional(),
  deadline: z.coerce.date(),
  priority: z.nativeEnum(priority_enum),
  status: z.nativeEnum(issue_status_enum),
  target: z.string(),
});

export type create_issue_dto_type = z.infer<typeof create_issue_dto>;
export { issue_dto };
