import { Verse } from "@/worker/domain/entities/Verse";
import type { IVersesRepository } from "@/worker/domain/interface/repositories/IVersesRepository";
import type { IFindAllVersesUseCase } from "@/worker/domain/interface/usecase/verses/IFindAllVersesUseCase";
import { inject, injectable } from "tsyringe";

@injectable()
export class FindAllVersesUseCase implements IFindAllVersesUseCase {
  constructor(
    @inject("IVersesRepository")
    private readonly versesRepository: IVersesRepository
  ) {}

  async execute(): Promise<Verse[]> {
    const verses = await this.versesRepository.findAll();
    return verses;
  }
}
