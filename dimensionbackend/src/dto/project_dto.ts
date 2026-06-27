import * as z from "zod";
import {
  project_health_enum,
  project_priority_enum,
  project_status_enum,
} from "../../enums";
import { create_issue_dto_type, issue_dto_type } from "./issue_dto";
export const project_dto = z.object({
  title: z.string(),
  description: z.string().optional(),
  target_date: z.date().optional(),
  health: z.enum(project_health_enum).optional(),
  priority: z.enum(project_priority_enum).optional(),
  status: z.enum(project_status_enum).optional(),
  issue: z.array(z.custom<create_issue_dto_type>()).nullish().optional(),
});
