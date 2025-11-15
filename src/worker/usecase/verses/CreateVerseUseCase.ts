import { Verse } from "@/worker/domain/entities/Verse";
import { Senryu } from "@/worker/domain/entities/Senryu";
import type { IVersesRepository } from "@/worker/domain/interface/repositories/IVersesRepository";
import type { ICreateVerseUseCase } from "@/worker/domain/interface/usecase/verses/ICreateVerseUseCase";
import { VERSE_TYPES } from "@/worker/domain/value-object/VerseForm";
import { BadRequest, InternalError } from "@/worker/common/error";
import { inject, injectable } from "tsyringe";
import { v4 as uuid } from "uuid";
import { CreateVerseSchema } from "@/shared/schema/CreateVerseSchema";
import { Haiku } from "@/worker/domain/entities/Haiku";
import type { IKigoDetectionService } from "@/worker/domain/interface/service/KigoDetectionService";
import type { IMoraCounterService } from "@/worker/service/MoraCounterService";

@injectable()
export class CreateVerseUseCase implements ICreateVerseUseCase {
  constructor(
    @inject("IVersesRepository")
    private readonly versesRepository: IVersesRepository,
    @inject("IKigoDetectionService")
    private readonly kigoDetectionService: IKigoDetectionService,
    @inject("IMoraCounterService")
    private readonly moraCounterService: IMoraCounterService
  ) {}

  async execute(
    input: CreateVerseSchema & { userId: string; userName: string }
  ): Promise<Verse> {
    // 5-7-5の音数バリデーション（俳句・川柳の場合）
    if (input.type === VERSE_TYPES.haiku || input.type === VERSE_TYPES.senryu) {
      await this.validate575Pattern(input.lines);
    }

    const verse = this.createVerseEntity(input);

    if (verse.getType() === VERSE_TYPES.haiku) {
      const kigo = await this.kigoDetectionService.detectKigo(
        verse.getFullContent()
      );
      if (!kigo) {
        throw BadRequest("季語が含まれていません");
      }
    }

    const savedVerse = await this.versesRepository.create(verse);

    return savedVerse;
  }

  /**
   * 5-7-5の音数パターンをバリデーション
   */
  private async validate575Pattern(lines: string[]): Promise<void> {
    if (lines.length !== 3) {
      throw BadRequest("俳句・川柳は3つの句が必要です");
    }

    const expectedMora = [5, 7, 5];
    const lineNames = ["上の句", "中の句", "下の句"];

    for (let i = 0; i < lines.length; i++) {
      const moraCount = await this.moraCounterService.countMora(lines[i]);
      const expected = expectedMora[i];

      if (moraCount !== expected) {
        throw BadRequest(
          `${lineNames[i]}が${expected}音ではありません（現在: ${moraCount}音）`
        );
      }
    }
  }

  /**
   * 詩の種類に応じて適切なEntityを生成
   */
  private createVerseEntity(
    input: CreateVerseSchema & { userId: string; userName: string }
  ): Verse {
    const id = uuid();

    switch (input.type) {
      case VERSE_TYPES.senryu:
        if (input.lines.length !== 3) {
          throw BadRequest("川柳は3つの句が必要です");
        }
        return Senryu.create({
          id,
          userId: input.userId,
          userName: input.userName,
          isPublish: input.isPublish,
          isDeleted: false,
          firstLine: input.lines[0],
          secondLine: input.lines[1],
          thirdLine: input.lines[2],
        });

      case VERSE_TYPES.haiku:
        if (input.lines.length !== 3) {
          throw BadRequest("俳句は3つの句が必要です");
        }
        return Haiku.create({
          id,
          userId: input.userId,
          userName: input.userName,
          isPublish: input.isPublish,
          isDeleted: false,
          firstLine: input.lines[0],
          secondLine: input.lines[1],
          thirdLine: input.lines[2],
        });

      case VERSE_TYPES.tanka:
        throw InternalError("Tanka entity not implemented yet");

      case VERSE_TYPES.waka:
        throw InternalError("Waka entity not implemented yet");

      default:
        throw BadRequest(`Unknown verse type: ${input.type}`);
    }
  }
}
