import { inject, injectable } from "tsyringe";
import { DangosRepository } from "@/worker/infrastructure/DangosRepository";

export interface RemoveDangoInput {
  verseId: string;
  userId: string;
}

@injectable()
export class RemoveDangoUseCase {
  constructor(
    @inject("IDangosRepository")
    private dangosRepository: DangosRepository
  ) {}

  async execute(input: RemoveDangoInput): Promise<void> {
    await this.dangosRepository.remove(input.verseId, input.userId);
  }
}
