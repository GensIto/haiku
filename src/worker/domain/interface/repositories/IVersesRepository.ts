import { Verse } from "@/worker/domain/entities/Verse";
import { VERSE_TYPES } from "@/worker/domain/value-object/VerseForm";

export interface IVersesRepository {
  create(verse: Verse): Promise<Verse>;
  findById(id: string): Promise<Verse | null>;
  findAllByUserId(userId: string): Promise<Verse[]>;
  findAll(): Promise<Verse[]>;
  findLatest(): Promise<Verse[]>;
  findAllByType(
    type: (typeof VERSE_TYPES)[keyof typeof VERSE_TYPES]
  ): Promise<Verse[]>;
  update(verse: Verse): Promise<Verse>;
  delete(id: string): Promise<void>;
}
