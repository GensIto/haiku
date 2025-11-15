import { VERSE_TYPES } from "@/worker/domain/value-object/VerseForm";

export abstract class Verse {
  constructor(
    public readonly id: string,
    public readonly userId: string,
    public readonly userName: string,
    protected isPublish: boolean,
    protected isDeleted: boolean,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
    public readonly dangoCount: number = 0
  ) {}

  // すべての詩形式が実装すべき抽象メソッド
  abstract getType(): (typeof VERSE_TYPES)[keyof typeof VERSE_TYPES];
  abstract getLines(): string[];
  abstract getFullContent(): string;
  protected abstract validate(): void;
  abstract getUserName(): string;
  abstract getIsPublish(): boolean;
  abstract handleIsPublish(): void;
  abstract handleUnPublish(): void;
  abstract getIsDeleted(): boolean;
  abstract handleIsDeleted(): void;

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
    };
  }
}
