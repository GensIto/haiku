import { Verse } from "@/worker/domain/entities/Verse";
import { Senryu } from "@/worker/domain/entities/Senryu";
import type { IVersesRepository } from "@/worker/domain/interface/repositories/IVersesRepository";
import type { IUpdateVerseUseCase } from "@/worker/domain/interface/usecase/verses/IUpdateVerseUseCase";
import { VERSE_TYPES } from "@/worker/domain/value-object/VerseForm";
import {
  BadRequest,
  NotFound,
  Forbidden,
  InternalError,
} from "@/worker/common/error";
import { inject, injectable } from "tsyringe";
import { UpdateVerseSchema } from "@/shared/schema/UpdateVerseShema";

export type UpdateVerseInput = UpdateVerseSchema;

@injectable()
export class UpdateVerseUseCase implements IUpdateVerseUseCase {
  constructor(
    @inject("IVersesRepository")
    private readonly versesRepository: IVersesRepository
  ) {}

  async execute(input: UpdateVerseSchema): Promise<Verse> {
    // 1. 既存の詩を取得
    const existingVerse = await this.versesRepository.findById(input.id);
    if (!existingVerse) {
      throw NotFound(`Verse with id ${input.id} not found`);
    }

    // 2. 権限チェック: 作者本人のみ更新可能
    if (existingVerse.userId !== input.userId) {
      throw Forbidden("You can only update your own verses");
    }

    // 3. 更新後のEntityを生成（バリデーション含む）
    const updatedVerse = this.reconstructVerseEntity(input, existingVerse);

    // 4. 永続化
    const savedVerse = await this.versesRepository.update(updatedVerse);

    return savedVerse;
  }

  /**
   * 既存の詩を更新して新しいEntityを生成
   */
  private reconstructVerseEntity(
    input: UpdateVerseSchema,
    existingVerse: Verse
  ): Verse {
    switch (input.type) {
      case VERSE_TYPES.senryu:
        if (input.lines.length !== 3) {
          throw BadRequest("川柳は3つの句が必要です");
        }
        // reconstruct を使って既存のタイムスタンプを保持
        return Senryu.reconstruct({
          id: input.id,
          firstLine: input.lines[0],
          secondLine: input.lines[1],
          thirdLine: input.lines[2],
          userId: input.userId,
          userName: existingVerse.userName,
          isPublish: input.isPublish,
          isDeleted: input.isDeleted,
          createdAt: existingVerse.createdAt,
          updatedAt: new Date(), // 更新日時は現在時刻
        });

      case VERSE_TYPES.haiku:
        throw InternalError("Haiku entity not implemented yet");

      case VERSE_TYPES.tanka:
        throw InternalError("Tanka entity not implemented yet");

      case VERSE_TYPES.waka:
        throw InternalError("Waka entity not implemented yet");

      default:
        throw BadRequest(`Unknown verse type: ${input.type}`);
    }
  }
}
