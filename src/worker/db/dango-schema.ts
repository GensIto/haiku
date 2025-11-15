import { users } from "@/worker/db/auth-schema";
import { verses } from "@/worker/db/verse-schema";
import { sql } from "drizzle-orm";
import { primaryKey, sqliteTable, text } from "drizzle-orm/sqlite-core";

/**
 * 団子（お気に入り）テーブル
 * - ユーザーが詩に対して送った団子を保存
 * - verse_idとuser_idの複合主キーで重複を防止
 */
export const dangos = sqliteTable(
  "dangos",
  {
    verse_id: text("verse_id")
      .notNull()
      .references(() => verses.id, { onDelete: "cascade" }),

    user_id: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),

    createdAt: text("createdAt")
      .notNull()
      .default(sql`(datetime('now'))`),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.verse_id, table.user_id] }),
  })
);
