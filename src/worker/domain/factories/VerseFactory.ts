import { InternalError } from "@/worker/common/error";
import { Haiku } from "@/worker/domain/entities/Haiku";
import { Senryu } from "@/worker/domain/entities/Senryu";
import { Verse } from "@/worker/domain/entities/Verse";
import { VERSE_TYPES } from "@/worker/domain/value-object/VerseForm";

/**
 * DBレコードからVerseエンティティを再構築するファクトリ
 */
export class VerseFactory {
  /**
   * DBレコードから適切なVerseエンティティを生成
   */
  static fromDbRecord(record: {
    id: string;
    type: string;
    lines: string[];
    user_id: string;
    user_name: string;
    is_publish: boolean;
    is_deleted: boolean;
    createdAt: string;
    updatedAt: string;
    dangoCount?: number;
  }): Verse {
    const baseProps = {
      id: record.id,
      userId: record.user_id,
      createdAt: new Date(record.createdAt),
      updatedAt: new Date(record.updatedAt),
      dangoCount: record.dangoCount ?? 0,
    };

    switch (record.type) {
      case VERSE_TYPES.senryu:
        return Senryu.reconstruct({
          ...baseProps,
          userName: record.user_name,
          isPublish: record.is_publish,
          isDeleted: record.is_deleted,
          firstLine: record.lines[0],
          secondLine: record.lines[1],
          thirdLine: record.lines[2],
        });

      case VERSE_TYPES.haiku:
        return Haiku.reconstruct({
          ...baseProps,
          userName: record.user_name,
          isPublish: record.is_publish,
          isDeleted: record.is_deleted,
          firstLine: record.lines[0],
          secondLine: record.lines[1],
          thirdLine: record.lines[2],
        });

      case VERSE_TYPES.tanka:
        // TODO: Tankaエンティティの実装後に追加
        throw InternalError(
          `Tanka entity not implemented yet. Type: ${record.type}`
        );

      case VERSE_TYPES.waka:
        // TODO: Wakaエンティティの実装後に追加
        throw InternalError(
          `Waka entity not implemented yet. Type: ${record.type}`
        );

      default:
        throw InternalError(`Unknown verse type: ${record.type}`);
    }
  }

  /**
   * Verseエンティティの配列をDBレコードから生成
   */
  static fromDbRecords(
    records: Array<{
      id: string;
      type: string;
      lines: string[];
      user_id: string;
      user_name: string;
      is_publish: boolean;
      is_deleted: boolean;
      createdAt: string;
      updatedAt: string;
      dangoCount?: number;
    }>
  ): Verse[] {
    return records.map((record) => VerseFactory.fromDbRecord(record));
  }
}
