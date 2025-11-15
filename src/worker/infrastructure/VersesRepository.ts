import { DatabaseProviderToken, type DatabaseProvider } from "@/worker/db";
import { verses } from "@/worker/db/verse-schema";
import { dangos } from "@/worker/db/dango-schema";
import { Verse } from "@/worker/domain/entities/Verse";
import { VerseFactory } from "@/worker/domain/factories/VerseFactory";
import { IVersesRepository } from "@/worker/domain/interface/repositories/IVersesRepository";
import { inject, injectable } from "tsyringe";
import { and, desc, eq, sql } from "drizzle-orm";
import { VERSE_TYPES } from "@/worker/domain/value-object/VerseForm";

@injectable()
export class VersesRepository implements IVersesRepository {
  constructor(
    @inject(DatabaseProviderToken)
    private readonly db: DatabaseProvider
  ) {}

  async create(verse: Verse): Promise<Verse> {
    const verseObject = verse.toObject();
    const [record] = await this.db
      .insert(verses)
      .values({
        id: verseObject.id,
        type: verseObject.type,
        lines: verseObject.lines,
        user_id: verseObject.userId,
        user_name: verseObject.userName,
        is_publish: verseObject.isPublish,
        is_deleted: verseObject.isDeleted,
        createdAt: verseObject.createdAt,
        updatedAt: verseObject.updatedAt,
      })
      .returning();

    // DBレコードから適切な型のVerseエンティティを再構築
    return VerseFactory.fromDbRecord(record);
  }

  async findById(id: string): Promise<Verse | null> {
    const [record] = await this.db
      .select()
      .from(verses)
      .where(
        and(
          eq(verses.id, id),
          eq(verses.is_deleted, false),
          eq(verses.is_publish, true)
        )
      );
    if (!record) {
      return null;
    }
    return VerseFactory.fromDbRecord(record);
  }

  async findAllByUserId(userId: string): Promise<Verse[]> {
    const records = await this.db
      .select({
        id: verses.id,
        type: verses.type,
        lines: verses.lines,
        user_id: verses.user_id,
        user_name: verses.user_name,
        is_publish: verses.is_publish,
        is_deleted: verses.is_deleted,
        createdAt: verses.createdAt,
        updatedAt: verses.updatedAt,
        dangoCount: sql<number>`CAST(COUNT(${dangos.verse_id}) AS INTEGER)`,
      })
      .from(verses)
      .leftJoin(dangos, eq(verses.id, dangos.verse_id))
      .where(eq(verses.user_id, userId))
      .groupBy(verses.id);
    return records.map((record) => VerseFactory.fromDbRecord(record));
  }

  async findAllByType(
    type: (typeof VERSE_TYPES)[keyof typeof VERSE_TYPES]
  ): Promise<Verse[]> {
    const records = await this.db
      .select({
        id: verses.id,
        type: verses.type,
        lines: verses.lines,
        user_id: verses.user_id,
        user_name: verses.user_name,
        is_publish: verses.is_publish,
        is_deleted: verses.is_deleted,
        createdAt: verses.createdAt,
        updatedAt: verses.updatedAt,
        dangoCount: sql<number>`CAST(COUNT(${dangos.verse_id}) AS INTEGER)`,
      })
      .from(verses)
      .leftJoin(dangos, eq(verses.id, dangos.verse_id))
      .where(
        and(
          eq(verses.type, type),
          eq(verses.is_deleted, false),
          eq(verses.is_publish, true)
        )
      )
      .groupBy(verses.id);
    return records.map((record) => VerseFactory.fromDbRecord(record));
  }

  async findAll(): Promise<Verse[]> {
    const records = await this.db
      .select({
        id: verses.id,
        type: verses.type,
        lines: verses.lines,
        user_id: verses.user_id,
        user_name: verses.user_name,
        is_publish: verses.is_publish,
        is_deleted: verses.is_deleted,
        createdAt: verses.createdAt,
        updatedAt: verses.updatedAt,
        dangoCount: sql<number>`CAST(COUNT(${dangos.verse_id}) AS INTEGER)`,
      })
      .from(verses)
      .leftJoin(dangos, eq(verses.id, dangos.verse_id))
      .where(and(eq(verses.is_deleted, false), eq(verses.is_publish, true)))
      .groupBy(verses.id);
    return records.map((record) => VerseFactory.fromDbRecord(record));
  }

  async findLatest(): Promise<Verse[]> {
    const records = await this.db
      .select({
        id: verses.id,
        type: verses.type,
        lines: verses.lines,
        user_id: verses.user_id,
        user_name: verses.user_name,
        is_publish: verses.is_publish,
        is_deleted: verses.is_deleted,
        createdAt: verses.createdAt,
        updatedAt: verses.updatedAt,
        dangoCount: sql<number>`CAST(COUNT(${dangos.verse_id}) AS INTEGER)`,
      })
      .from(verses)
      .leftJoin(dangos, eq(verses.id, dangos.verse_id))
      .where(and(eq(verses.is_deleted, false), eq(verses.is_publish, true)))
      .orderBy(desc(verses.createdAt))
      .groupBy(verses.id)
      .limit(3);
    return records.map((record) => VerseFactory.fromDbRecord(record));
  }

  async update(verse: Verse): Promise<Verse> {
    const verseObject = verse.toObject();
    const [record] = await this.db
      .update(verses)
      .set(verseObject)
      .where(eq(verses.id, verseObject.id))
      .returning();
    return VerseFactory.fromDbRecord(record);
  }

  async delete(id: string): Promise<void> {
    const now = new Date();
    await this.db
      .update(verses)
      .set({ is_deleted: true, updatedAt: now.toISOString() })
      .where(eq(verses.id, id));
  }
}
