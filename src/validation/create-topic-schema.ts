import { z } from "zod";

export const createTopicSchema = z.object({
  name: z.string().max(50).min(1),
  deadline: z.string().optional(),
  description: z.string().optional(),
});
