import type { IVersesRepository } from "@/worker/domain/interface/repositories/IVersesRepository";
import type { IDeleteVerseUseCase } from "@/worker/domain/interface/usecase/verses/IDeleteVerseUseCase";
import { NotFound, Forbidden } from "@/worker/common/error";
import { inject, injectable } from "tsyringe";

export type DeleteVerseInput = {
  id: string;
  userId: string; // 削除リクエストを行うユーザーID（権限チェック用）
};

@injectable()
export class DeleteVerseUseCase implements IDeleteVerseUseCase {
  constructor(
    @inject("IVersesRepository")
    private readonly versesRepository: IVersesRepository
  ) {}

  async execute(input: DeleteVerseInput): Promise<void> {
    // 1. 既存の詩を取得
    const existingVerse = await this.versesRepository.findById(input.id);
    if (!existingVerse) {
      throw NotFound(`Verse with id ${input.id} not found`);
    }

    // 2. 権限チェック: 作者本人のみ削除可能
    if (existingVerse.userId !== input.userId) {
      throw Forbidden("You can only delete your own verses");
    }

    // 3. 削除実行
    await this.versesRepository.delete(input.id);
  }
}
