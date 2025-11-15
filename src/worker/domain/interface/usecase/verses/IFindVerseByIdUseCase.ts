import { Verse } from "@/worker/domain/entities/Verse";

export interface IFindVerseByIdUseCase {
  execute(id: string): Promise<Verse>;
}
