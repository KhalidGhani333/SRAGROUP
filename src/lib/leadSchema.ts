import { z } from "zod";

const required = z.string().trim().min(1, "required");
const optionalNumber = z
  .string()
  .trim()
  .refine((value) => {
    if (!value) return true;
    const number = Number(
      value
        .replace(/\s/g, "")
        .replace(/\.(?=\d{3}\b)/g, "")
        .replace(",", "."),
    );
    return Number.isFinite(number) && number > 0;
  }, "number");

// Only name, email and telephone are mandatory; supplied numeric details must still be valid.
export const leadSchema = z.object({
  division: z.enum(["construction", "solar", "general"]),
  projectType: z.string(),
  area: optionalNumber,
  installationType: z.enum(["", "roof", "park"]),
  sizingMode: z.literal("power"),
  power: optionalNumber,
  location: z.string().trim(),
  timeline: z.string(),
  subject: z.string().trim(),
  firstName: required,
  lastName: z.string().trim(),
  company: z.string().trim(),
  role: z.string().trim(),
  email: required.email("email"),
  phone: required.regex(/^\+?[0-9\s().-]{6,20}$/, "phone"),
  message: z.string().trim(),
  gdpr: z.boolean(),
});

export type LeadForm = z.infer<typeof leadSchema>;
