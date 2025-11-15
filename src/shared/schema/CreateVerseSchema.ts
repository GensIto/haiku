import { z } from "zod";
import { VERSE_TYPES } from "@/worker/domain/value-object/VerseForm";

export const CreateVerseSchema = z.object({
  type: z.enum(Object.values(VERSE_TYPES) as [string, ...string[]]),
  lines: z.array(z.string()),
  isPublish: z.boolean(),
});

export type CreateVerseSchema = z.infer<typeof CreateVerseSchema>;
