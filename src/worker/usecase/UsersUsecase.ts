import type { IUsersUsecase } from "@/worker/domain/interface/usecase/IUsersUsecase";
import { User } from "@/worker/domain/entities/User";
import { inject, injectable } from "tsyringe";
import { UsersRepository } from "@/worker/infrastructure/UsersRepository";

@injectable()
export class UsersUsecase implements IUsersUsecase {
  constructor(
    @inject(UsersRepository)
    private readonly usersRepository: UsersRepository
  ) {}

  async get(email: string): Promise<User> {
    const user = await this.usersRepository.get(email);
    return user;
  }
}
