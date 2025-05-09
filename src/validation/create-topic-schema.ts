import { z } from "zod";

export const createTopicSchema = z.object({
  name: z.string().max(50).min(1),
  description: z.string().optional(),
});
