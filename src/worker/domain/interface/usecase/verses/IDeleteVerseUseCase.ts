import type { DeleteVerseInput } from "@/worker/usecase/verses/DeleteVerseUseCase";

export interface IDeleteVerseUseCase {
  execute(input: DeleteVerseInput): Promise<void>;
}
