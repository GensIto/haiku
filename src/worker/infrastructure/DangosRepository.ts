import { inject, injectable } from "tsyringe";
import { IDangosRepository } from "@/worker/domain/interface/repositories/IDangosRepository";
import { DatabaseProviderToken, type DatabaseProvider } from "@/worker/db";
import { dangos } from "@/worker/db/dango-schema";
import { and, eq } from "drizzle-orm";

@injectable()
export class DangosRepository implements IDangosRepository {
  constructor(
    @inject(DatabaseProviderToken)
    private readonly db: DatabaseProvider
  ) {}

  async add(verseId: string, userId: string): Promise<void> {
    await this.db.insert(dangos).values({
      verse_id: verseId,
      user_id: userId,
    });
  }

  async remove(verseId: string, userId: string): Promise<void> {
    await this.db
      .delete(dangos)
      .where(and(eq(dangos.verse_id, verseId), eq(dangos.user_id, userId)));
  }

  async hasDango(verseId: string, userId: string): Promise<boolean> {
    const result = await this.db
      .select()
      .from(dangos)
      .where(and(eq(dangos.verse_id, verseId), eq(dangos.user_id, userId)))
      .limit(1);
    return result.length > 0;
  }
}
