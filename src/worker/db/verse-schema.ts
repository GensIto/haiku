import { users } from "@/worker/db/auth-schema";
import { VERSE_TYPES } from "@/worker/domain/value-object/VerseForm";
import { sql } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

/**
 * 詩（短詩型文学）を保存するテーブル
 * - 川柳、俳句、短歌、和歌など、様々な詩形式に対応
 * - typeカラムで詩の種類を判別
 */
export const verses = sqliteTable("verses", {
  id: text("id").primaryKey(),

  // 詩の種類: "senryu" | "haiku" | "tanka" | "waka"
  type: text("type", {
    enum: [
      VERSE_TYPES.haiku,
      VERSE_TYPES.senryu,
      VERSE_TYPES.tanka,
      VERSE_TYPES.waka,
    ],
  }).notNull(),

  // 句のコンテンツ（JSON配列）
  // 川柳/俳句: [上の句, 中の句, 下の句] (3要素)
  // 短歌: [第一句, 第二句, 第三句, 第四句, 第五句] (5要素)
  // https://orm.drizzle.team/docs/guides/empty-array-default-value#sqlite
  lines: text("lines", { mode: "json" }).$type<string[]>().notNull(),

  // 作者
  user_id: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  user_name: text("user_name").notNull(),

  // 公開状態: true: 公開, false: 非公開
  is_publish: integer("is_publish", { mode: "boolean" })
    .notNull()
    .default(false),

  // 削除状態: true: 削除, false: 削除していない
  is_deleted: integer("is_deleted", { mode: "boolean" })
    .notNull()
    .default(false),

  // タイムスタンプ（ISO 8601形式）
  createdAt: text("createdAt")
    .notNull()
    .default(sql`(datetime('now'))`),
  updatedAt: text("updatedAt")
    .notNull()
    .default(sql`(datetime('now'))`),
});
