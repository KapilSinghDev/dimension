import * as z from "zod";
import {
  project_health_enum,
  project_priority_enum,
  project_status_enum,
} from "../../enums";
import { issue_dto_type } from "./issue_dto";
export const project_dto = z.object({
  title: z.string(),
  description: z.string().optional(),
  target_date: z.date(),
  health: z.enum(project_health_enum),
  priority: z.enum(project_priority_enum),
  status: z.enum(project_status_enum),
  issue: z.array(z.custom<issue_dto_type>()).nullish(),
});
