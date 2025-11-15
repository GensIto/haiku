import { User } from "@/worker/domain/entities/User";

export interface IUsersRepository {
  get(email: string): Promise<User>;
}
