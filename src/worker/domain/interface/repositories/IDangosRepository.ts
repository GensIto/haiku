export interface IDangosRepository {
  add(verseId: string, userId: string): Promise<void>;
  remove(verseId: string, userId: string): Promise<void>;

  hasDango(verseId: string, userId: string): Promise<boolean>;
}
