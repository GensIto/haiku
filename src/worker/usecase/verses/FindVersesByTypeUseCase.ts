import { Verse } from "@/worker/domain/entities/Verse";
import type { IVersesRepository } from "@/worker/domain/interface/repositories/IVersesRepository";
import type { IFindVersesByTypeUseCase } from "@/worker/domain/interface/usecase/verses/IFindVersesByTypeUseCase";
import type { VerseTypeValue } from "@/worker/domain/value-object/VerseForm";
import { inject, injectable } from "tsyringe";

@injectable()
export class FindVersesByTypeUseCase implements IFindVersesByTypeUseCase {
  constructor(
    @inject("IVersesRepository")
    private readonly versesRepository: IVersesRepository
  ) {}

  async execute(type: VerseTypeValue): Promise<Verse[]> {
    const verses = await this.versesRepository.findAllByType(type);
    return verses;
  }
}
