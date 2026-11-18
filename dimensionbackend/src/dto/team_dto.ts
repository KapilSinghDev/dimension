import * as z from "zod";
import type { user_profile_dto_type } from "./user_dto";
import type { issue_dto_type } from "./issue_dto";
import { team_status_enum } from "../../enums";

const team_dto = z.object({
  team_id: z.number(),
  name: z.string(),
  status: z.enum(team_status_enum),
  members: z.array(z.custom<user_profile_dto_type>()),
  issue_assigned: z.array(z.custom<issue_dto_type>()),
});
type team_dto_type = {
  team_id: number;
  name: string;
  status: team_status_enum;
  members: user_profile_dto_type[];
  issue_assigned: issue_dto_type[];
};
export const create_team_dto = z.object({
  name: z.string(),
  status: z.enum(team_status_enum).optional(),
  members: z.array(z.string()).optional(),
  issues: z.array(z.string()).optional(),
  target: z.string(),
});
export type create_team_dto_type = {
  name: string;
  members: string[];
  issues: number[];
  status?: team_status_enum;
  // target: string;
};
export { team_dto, team_dto_type };
