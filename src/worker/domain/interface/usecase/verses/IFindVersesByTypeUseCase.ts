import { Verse } from "@/worker/domain/entities/Verse";
import type { VerseTypeValue } from "@/worker/domain/value-object/VerseForm";

export interface IFindVersesByTypeUseCase {
  execute(type: VerseTypeValue): Promise<Verse[]>;
}
