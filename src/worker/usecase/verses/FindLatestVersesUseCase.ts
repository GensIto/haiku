import { Verse } from "@/worker/domain/entities/Verse";
import type { IVersesRepository } from "@/worker/domain/interface/repositories/IVersesRepository";
import type { IFindLatestVersesUseCase } from "@/worker/domain/interface/usecase/verses/IFindLatestVersesUseCase";
import { inject, injectable } from "tsyringe";

@injectable()
export class FindLatestVersesUseCase implements IFindLatestVersesUseCase {
  constructor(
    @inject("IVersesRepository")
    private readonly versesRepository: IVersesRepository
  ) {}

  async execute(): Promise<Verse[]> {
    const verses = await this.versesRepository.findLatest();
    return verses ?? [];
  }
}
