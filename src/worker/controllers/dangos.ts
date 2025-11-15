import { Hono } from "hono";
import { inject, injectable } from "tsyringe";
import { auth } from "@/worker/lib/auth";
import { ContextProvider } from "@/worker/infrastructure/providers/ContextProvider";
import { AddDangoUseCase } from "@/worker/usecase/dangos/AddDangoUseCase";
import { RemoveDangoUseCase } from "@/worker/usecase/dangos/RemoveDangoUseCase";
import { CheckDangoUseCase } from "@/worker/usecase/dangos/CheckDangoUseCase";

@injectable()
export class DangosController {
  controller = new Hono<{
    Bindings: Env;
    Variables: {
      user: typeof auth.$Infer.Session.user | null;
      session: typeof auth.$Infer.Session.session | null;
    };
  }>();

  constructor(
    @inject(AddDangoUseCase)
    private readonly addDangoUseCase: AddDangoUseCase,
    @inject(RemoveDangoUseCase)
    private readonly removeDangoUseCase: RemoveDangoUseCase,
    @inject(CheckDangoUseCase)
    private readonly checkDangoUseCase: CheckDangoUseCase,
    @inject("IContextProvider") private contextProvider: ContextProvider
  ) {}

  routes() {
    return this.controller
      .use("*", async (c, next) => {
        this.contextProvider.setContext(c);

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
      .get("/:verseId", async (c) => {
        const { verseId } = c.req.param();
        const session = c.get("session");
        if (!session) {
          return c.json({ error: "Unauthorized" }, 401);
        }

        const hasDango = await this.checkDangoUseCase.execute({
          verseId,
          userId: session.userId,
        });

        return c.json({ hasDango });
      })
      .post("/:verseId", async (c) => {
        const { verseId } = c.req.param();
        const session = c.get("session");
        if (!session) {
          return c.json({ error: "Unauthorized" }, 401);
        }

        await this.addDangoUseCase.execute({
          verseId,
          userId: session.userId,
        });

        return c.json({ success: true });
      })
      .delete("/:verseId", async (c) => {
        const { verseId } = c.req.param();
        const session = c.get("session");
        if (!session) {
          return c.json({ error: "Unauthorized" }, 401);
        }

        await this.removeDangoUseCase.execute({
          verseId,
          userId: session.userId,
        });

        return c.json({ success: true });
      });
  }
}
