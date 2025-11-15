import { Verse } from "@/worker/domain/entities/Verse";
import type { IVersesRepository } from "@/worker/domain/interface/repositories/IVersesRepository";
import type { IFindVersesByUserUseCase } from "@/worker/domain/interface/usecase/verses/IFindVersesByUserUseCase";
import { inject, injectable } from "tsyringe";

@injectable()
export class FindVersesByUserUseCase implements IFindVersesByUserUseCase {
  constructor(
    @inject("IVersesRepository")
    private readonly versesRepository: IVersesRepository
  ) {}

  async execute(userId: string): Promise<Verse[]> {
    const verses = await this.versesRepository.findAllByUserId(userId);
    return verses;
  }
}
