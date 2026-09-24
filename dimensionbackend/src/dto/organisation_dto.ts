import { z } from "zod";

export const createOrganisationSchema = z.object({
  name: z
    .string({ message: "Name is required" })
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name cannot exceed 100 characters")
    .trim(),

  description: z
    .string()
    .max(500, "Description cannot exceed 500 characters")
    .trim()
    .nullable()
    .optional(),

  joining_date: z.coerce
    .date({ message: "Invalid date format" })
    .default(() => new Date()),
});

export const updateOrganisationSchema = createOrganisationSchema.partial();

export const organisationIdParamSchema = z.object({
  id: z.coerce
    .number({ message: "ID must be a number" })
    .int("ID must be an integer")
    .positive("ID must be a positive integer"),
});

export type CreateOrganisationDto = z.infer<typeof createOrganisationSchema>;
export type UpdateOrganisationDto = z.infer<typeof updateOrganisationSchema>;
export type OrganisationIdParamDto = z.infer<typeof organisationIdParamSchema>;
