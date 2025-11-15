import { CreateVerseSchema } from "@/shared/schema/CreateVerseSchema";
import { Verse } from "@/worker/domain/entities/Verse";

export interface ICreateVerseUseCase {
  execute(input: CreateVerseSchema): Promise<Verse>;
}
