import { z } from "zod";

export const createMeetingSchema = z.object({
  recurring: z.boolean().optional(),
  dateTime: z.string(),
});
