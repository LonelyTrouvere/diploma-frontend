import { z } from "zod";

export const updateTopicSchema = z.object({
  name: z.string().max(50).optional(),
  description: z.string().optional(),
});
