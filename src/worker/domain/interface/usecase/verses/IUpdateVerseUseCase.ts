import { Verse } from "@/worker/domain/entities/Verse";
import type { UpdateVerseInput } from "@/worker/usecase/verses/UpdateVerseUseCase";

export interface IUpdateVerseUseCase {
  execute(input: UpdateVerseInput): Promise<Verse>;
}
