import { Verse } from "@/worker/domain/entities/Verse";

export interface IFindAllVersesUseCase {
  execute(): Promise<Verse[]>;
}
