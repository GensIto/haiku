import { inject, injectable } from "tsyringe";
import { IDangosRepository } from "@/worker/domain/interface/repositories/IDangosRepository";

@injectable()
export class CheckDangoUseCase {
  constructor(
    @inject("IDangosRepository")
    private readonly dangosRepository: IDangosRepository
  ) {}

  async execute(input: {
    verseId: string;
    userId: string;
  }): Promise<boolean> {
    return await this.dangosRepository.hasDango(input.verseId, input.userId);
  }
}
