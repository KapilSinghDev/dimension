import * as z from "zod";
import type { team_dto_type } from "./team_dto";
import type { issue_dto_type } from "./issue_dto";

const user_credentials_dto = z.object({
  firstname: z.string(),
  lastname: z.string(),
  email: z.string(),
  password: z.string(),
  image: z
    .file()
    .mime(["image/jpeg", "image/png"])
    .max(5 * 1024 * 1024)
    .optional(),
});
type user_credentials_dto_type = z.infer<typeof user_credentials_dto>;

const user_dto = user_credentials_dto.extend({
  role: z.string(),
  organisation: z.string(),
  team: z.string(),
  issue: z.array(z.number()),
});
type user_dto_type = z.infer<typeof user_dto>;

const user_login_dto = z.object({
  email: z.email(),
  password: z.string(),
});
type user_login_dto_type = z.infer<typeof user_login_dto>;

const user_profile_dto = z.object({
  role: z.string(),
  organisation: z.string(),
  team: z.custom<team_dto_type>(),
  issue: z.array(z.custom<issue_dto_type>()),
});
type user_profile_dto_type = {
  role: string;
  organisation: string;
  team: team_dto_type;
  issue: issue_dto_type[];
};

export const search_user_dto = z.object({
  email: z.email(),
});

export const update_profile_dto = z.object({
  user_email: z.email(),
  role: z.string().optional(),
  organisation: z.string().optional(),
  url: z.string().optional(),
});
export {
  user_credentials_dto,
  user_credentials_dto_type,
  user_dto,
  user_dto_type,
  user_login_dto,
  user_login_dto_type,
  user_profile_dto,
  user_profile_dto_type,
};
