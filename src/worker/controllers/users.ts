import { Env, Hono } from "hono";
import { inject, injectable } from "tsyringe";
import { UsersUsecase } from "@/worker/usecase/UsersUsecase";
import { auth } from "@/worker/lib/auth";

@injectable()
export class UsersController {
  controller = new Hono<{
    Bindings: Env;
    Variables: {
      user: typeof auth.$Infer.Session.user | null;
      session: typeof auth.$Infer.Session.session | null;
    };
  }>();

  constructor(
    @inject(UsersUsecase)
    private readonly usersUsecase: UsersUsecase
  ) {}

  routes() {
    return this.controller
      .use("*", async (c, next) => {
        const session = await auth.api.getSession({
          headers: c.req.raw.headers,
        });
        if (!session) {
          return c.json({ error: "Unauthorized" }, 401);
        }
        c.set("user", session.user);
        c.set("session", session.session);
        await next();
      })
      .get("/me", async (c) => {
        const userCntext = c.get("user");
        if (!userCntext) {
          return c.json({ error: "Unauthorized" }, 401);
        }
        const user = await this.usersUsecase.get(userCntext.email);
        return c.json({ user: user.toObject() });
      });
  }
}
