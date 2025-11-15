import { Verse } from "@/worker/domain/entities/Verse";

export interface IFindLatestVersesUseCase {
  execute(): Promise<Verse[]>;
}
