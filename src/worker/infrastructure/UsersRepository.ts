import { eq } from "drizzle-orm";

import { users } from "@/worker/db/auth-schema";
import { type DatabaseProvider, DatabaseProviderToken } from "@/worker/db";
import { IUsersRepository } from "@/worker/domain/interface/repositories/IUsersRepository";
import { User } from "@/worker/domain/entities/User";
import { NotFound } from "@/worker/common/error";
import { inject, injectable } from "tsyringe";

@injectable()
export class UsersRepository implements IUsersRepository {
  constructor(
    @inject(DatabaseProviderToken)
    private readonly db: DatabaseProvider
  ) {}

  async get(email: string): Promise<User> {
    const [row] = await this.db
      .select()
      .from(users)
      .where(eq(users.email, email));

    if (!row) {
      throw NotFound("User not found");
    }

    return User.create({
      id: row.id,
      name: row.name,
      email: row.email,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    });
  }
}
