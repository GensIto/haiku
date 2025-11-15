import { BadRequest } from "@/worker/common/error";

export const VERSE_TYPES = {
  haiku: "haiku",
  senryu: "senryu",
  tanka: "tanka",
  waka: "waka",
} as const;
export type VerseTypeValue = (typeof VERSE_TYPES)[keyof typeof VERSE_TYPES];

export const VERSE_LABELS = {
  haiku: "俳句",
  senryu: "川柳",
  tanka: "短歌",
  waka: "和歌",
} as const;
export type VerseLabelValue = (typeof VERSE_LABELS)[keyof typeof VERSE_LABELS];

export class VerseType {
  private constructor(public readonly type: VerseTypeValue) {
    VerseType.validate(type);
    this.type = type;
  }

  static create(type: VerseTypeValue) {
    return new VerseType(type);
  }

  getValue() {
    return this.type;
  }

  static validate(type: VerseTypeValue) {
    if (!Object.values(VERSE_TYPES).includes(type)) {
      throw BadRequest(`Invalid verse type: ${type}`);
    }
    return new VerseType(type);
  }
}
