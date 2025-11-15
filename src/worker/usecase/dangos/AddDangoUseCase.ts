import { inject, injectable } from "tsyringe";
import { DangosRepository } from "@/worker/infrastructure/DangosRepository";

export interface AddDangoInput {
  verseId: string;
  userId: string;
}

@injectable()
export class AddDangoUseCase {
  constructor(
    @inject("IDangosRepository")
    private dangosRepository: DangosRepository
  ) {}

  async execute(input: AddDangoInput): Promise<void> {
    await this.dangosRepository.add(input.verseId, input.userId);
  }
}
