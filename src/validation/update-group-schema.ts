import { z } from "zod";

export const updateGroupSchema = z.object({
  name: z.string().max(50).optional(),
});