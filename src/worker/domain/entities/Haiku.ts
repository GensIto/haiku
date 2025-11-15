import { BadRequest } from "@/worker/common/error";
import { Verse } from "@/worker/domain/entities/Verse";
import { VERSE_TYPES } from "@/worker/domain/value-object/VerseForm";

type HaikuProps = {
  id: string;
  userId: string;
  userName: string;
  isPublish: boolean;
  isDeleted: boolean;
  firstLine: string;
  secondLine: string;
  thirdLine: string;
};

type HaikuReconstructProps = HaikuProps & {
  createdAt: Date;
  updatedAt: Date;
  dangoCount?: number;
};

/**
 * 俳句エンティティ
 *
 * 俳句は「五・七・五」の17音で構成され、季節を表す「季語」を含む日本の定型詩です。
 * 短い言葉の中に、景色や感情などを表現する魅力があります。
 */
export class Haiku extends Verse {
  protected constructor(
    id: string,
    userId: string,
    userName: string,
    isPublish: boolean,
    isDeleted: boolean,
    createdAt: Date,
    updatedAt: Date,
    dangoCount: number,
    public readonly firstLine: string, // 上の句（5文字）
    public readonly secondLine: string, // 中の句（7文字）
    public readonly thirdLine: string // 下の句（5文字）
  ) {
    super(
      id,
      userId,
      userName,
      isPublish,
      isDeleted,
      createdAt,
      updatedAt,
      dangoCount
    );
  }

  static create(props: HaikuProps): Haiku {
    const now = new Date();
    const haiku = new Haiku(
      props.id,
      props.userId,
      props.userName,
      props.isPublish,
      props.isDeleted,
      now,
      now,
      0, // dangoCount
      props.firstLine,
      props.secondLine,
      props.thirdLine
    );

    haiku.validate();
    return haiku;
  }

  /**
   * DBから取得したデータでHaikuエンティティを再構築
   * バリデーションは行わない（DBに保存されたデータは既に検証済みと仮定）
   */
  static reconstruct(props: HaikuReconstructProps): Haiku {
    return new Haiku(
      props.id,
      props.userId,
      props.userName,
      props.isPublish,
      props.isDeleted,
      props.createdAt,
      props.updatedAt,
      props.dangoCount ?? 0,
      props.firstLine,
      props.secondLine,
      props.thirdLine
    );
  }

  /**
   * ドメインルールのバリデーション
   */
  protected validate() {
    // 5-7-5の音数チェック（文字数で簡易的に判定）
    if (this.firstLine.length !== 5) {
      throw BadRequest("上の句は5文字である必要があります");
    }
    if (this.secondLine.length !== 7) {
      throw BadRequest("中の句は7文字である必要があります");
    }
    if (this.thirdLine.length !== 5) {
      throw BadRequest("下の句は5文字である必要があります");
    }

    // 禁止文字チェック
    const content = this.getFullContent();
    if (content.includes(" ") || content.includes("　")) {
      throw BadRequest("川柳にスペースを含めることはできません");
    }
    if (content.includes("、") || content.includes("。")) {
      throw BadRequest("川柳に句読点を含めることはできません");
    }

    // 空行チェック
    if (
      !this.firstLine.trim() ||
      !this.secondLine.trim() ||
      !this.thirdLine.trim()
    ) {
      throw BadRequest("空の句を含めることはできません");
    }
  }

  /**
   * 詩の種類を取得
   */
  getType() {
    return VERSE_TYPES.haiku;
  }

  /**
   * 全文を1行で取得
   */
  getFullContent() {
    return this.firstLine + this.secondLine + this.thirdLine;
  }

  /**
   * フォーマット済みの内容を取得（改行付き）
   */
  getFormattedContent() {
    return `${this.firstLine}\n${this.secondLine}\n${this.thirdLine}`;
  }

  /**
   * 配列形式で句を取得
   */
  getLines() {
    return [this.firstLine, this.secondLine, this.thirdLine];
  }

  /**
   * userNameを取得
   */
  getUserName() {
    return this.userName;
  }

  /**
   * isPublishを取得
   */
  getIsPublish() {
    return this.isPublish;
  }

  /**
   * 公開にする
   */
  handleIsPublish() {
    this.isPublish = true;
  }

  /**
   * 非公開にする
   */
  handleUnPublish() {
    this.isPublish = false;
  }

  /**
   * isDeletedを取得
   */
  getIsDeleted() {
    return this.isDeleted;
  }

  /**
   * 削除にする
   */
  handleIsDeleted() {
    this.isDeleted = true;
  }
  /**
   * プレーンオブジェクトに変換
   */
  toObject() {
    return {
      id: this.id,
      type: this.getType(),
      lines: this.getLines(),
      userId: this.userId,
      userName: this.userName,
      isPublish: this.isPublish,
      isDeleted: this.isDeleted,
      createdAt: this.createdAt.toISOString(),
      updatedAt: this.updatedAt.toISOString(),
      dangoCount: this.dangoCount,
      firstLine: this.firstLine,
      secondLine: this.secondLine,
      thirdLine: this.thirdLine,
    };
  }
}
