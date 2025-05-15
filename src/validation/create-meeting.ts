import { z } from "zod";

export const createMeetingSchema = z.object({
  recurring: z.string().optional(),
  recurringRule: z.string().optional(),
  date: z.string(),
});
