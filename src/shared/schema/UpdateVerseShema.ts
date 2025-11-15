import { VERSE_TYPES } from "@/worker/domain/value-object/VerseForm";
import z from "zod";

export const UpdateVerseSchema = z.object({
  id: z.string(),
  type: z.enum(VERSE_TYPES),
  lines: z.array(z.string()),
  isPublish: z.boolean(),
  userId: z.string(),
  isDeleted: z.boolean(),
});

export type UpdateVerseSchema = z.infer<typeof UpdateVerseSchema>;
