import type { User } from "@/worker/domain/entities/User";

export interface IUsersUsecase {
  get(email: string): Promise<User>;
}
