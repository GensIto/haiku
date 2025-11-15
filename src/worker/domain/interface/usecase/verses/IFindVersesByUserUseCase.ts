import { Verse } from "@/worker/domain/entities/Verse";

export interface IFindVersesByUserUseCase {
  execute(userId: string): Promise<Verse[]>;
}
