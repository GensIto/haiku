import { Verse } from "@/worker/domain/entities/Verse";
import type { IVersesRepository } from "@/worker/domain/interface/repositories/IVersesRepository";
import type { IFindVerseByIdUseCase } from "@/worker/domain/interface/usecase/verses/IFindVerseByIdUseCase";
import { NotFound } from "@/worker/common/error";
import { inject, injectable } from "tsyringe";

@injectable()
export class FindVerseByIdUseCase implements IFindVerseByIdUseCase {
  constructor(
    @inject("IVersesRepository")
    private readonly versesRepository: IVersesRepository
  ) {}

  async execute(id: string): Promise<Verse> {
    const verse = await this.versesRepository.findById(id);

    if (!verse) {
      throw NotFound(`Verse with id ${id} not found`);
    }

    return verse;
  }
}
