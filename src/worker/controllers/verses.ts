import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { inject, injectable } from "tsyringe";
import { CreateVerseUseCase } from "@/worker/usecase/verses/CreateVerseUseCase";
import { CreateVerseSchema } from "@/shared/schema/CreateVerseSchema";
import {
  FindVerseByIdUseCase,
  FindVersesByUserUseCase,
  FindAllVersesUseCase,
  FindVersesByTypeUseCase,
  UpdateVerseUseCase,
  DeleteVerseUseCase,
} from "@/worker/usecase/verses";
import { UpdateVerseSchema } from "@/shared/schema/UpdateVerseShema";
import { VERSE_TYPES } from "@/worker/domain/value-object/VerseForm";
import z from "zod";
import { auth } from "@/worker/lib/auth";
import { ContextProvider } from "@/worker/infrastructure/providers/ContextProvider";
import { FindLatestVersesUseCase } from "@/worker/usecase/verses/FindLatestVersesUseCase";

@injectable()
export class VersesController {
  controller = new Hono<{
    Bindings: Env;
    Variables: {
      user: typeof auth.$Infer.Session.user | null;
      session: typeof auth.$Infer.Session.session | null;
    };
  }>();

  constructor(
    @inject(CreateVerseUseCase)
    private readonly createVerseUseCase: CreateVerseUseCase,
    @inject(FindVerseByIdUseCase)
    private readonly findVerseByIdUseCase: FindVerseByIdUseCase,
    @inject(FindVersesByUserUseCase)
    private readonly findVersesByUserUseCase: FindVersesByUserUseCase,
    @inject(FindAllVersesUseCase)
    private readonly findAllVersesUseCase: FindAllVersesUseCase,
    @inject(FindLatestVersesUseCase)
    private readonly findLatestVersesUseCase: FindLatestVersesUseCase,
    @inject(FindVersesByTypeUseCase)
    private readonly findVersesByTypeUseCase: FindVersesByTypeUseCase,
    @inject(UpdateVerseUseCase)
    private readonly updateVerseUseCase: UpdateVerseUseCase,
    @inject(DeleteVerseUseCase)
    private readonly deleteVerseUseCase: DeleteVerseUseCase,
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
      .get("/", async (c) => {
        const verses = await this.findAllVersesUseCase.execute();
        return c.json({ verses: verses.map((verse) => verse.toObject()) });
      })
      .get("/latest", async (c) => {
        const verses = await this.findLatestVersesUseCase.execute();
        return c.json({ verses: verses.map((verse) => verse.toObject()) });
      })
      .post("/", zValidator("json", CreateVerseSchema), async (c) => {
        const input = c.req.valid("json");
        const session = c.get("session");
        const user = c.get("user");
        if (!session || !user) {
          return c.json({ error: "Unauthorized" }, 401);
        }

        const verse = await this.createVerseUseCase.execute({
          ...input,
          userId: session.userId,
          userName: user.name,
        });

        return c.json({ verse: verse.toObject() });
      })
      .get("/user", async (c) => {
        const user = c.get("user");
        if (!user) {
          return c.json({ error: "Unauthorized" }, 401);
        }
        const verses = await this.findVersesByUserUseCase.execute(user.id);
        return c.json({ verses: verses.map((verse) => verse.toObject()) });
      })
      .get("/:id", async (c) => {
        const { id } = c.req.param();
        const verse = await this.findVerseByIdUseCase.execute(id);

        if (!verse) {
          return c.json({ error: "Verse not found" }, 404);
        }

        if (verse.getIsDeleted()) {
          return c.json({ error: "Verse is deleted" }, 404);
        }

        if (!verse.getIsPublish()) {
          return c.json({ error: "Verse is not published" }, 404);
        }

        return c.json({ verse: verse.toObject() });
      })
      .get(
        "/type/:type",
        zValidator("param", z.enum(VERSE_TYPES)),
        async (c) => {
          const type = c.req.valid("param");
          const verses = await this.findVersesByTypeUseCase.execute(type);
          return c.json({ verses: verses.map((verse) => verse.toObject()) });
        }
      )
      .put("/:id", zValidator("json", UpdateVerseSchema), async (c) => {
        const { id } = c.req.param();
        const { type, lines, userId, isPublish, isDeleted } =
          c.req.valid("json");
        const verse = await this.updateVerseUseCase.execute({
          id,
          type,
          lines,
          userId,
          isPublish,
          isDeleted,
        });
        return c.json({ verse: verse.toObject() });
      })
      .delete("/:id", async (c) => {
        const { id } = c.req.param();

        const session = c.get("session");
        const user = c.get("user");
        if (!session || !user) {
          return c.json({ error: "Unauthorized" }, 401);
        }
        await this.deleteVerseUseCase.execute({
          id,
          userId: user.id,
        });
        return c.json({ message: "Verse deleted successfully" });
      });
  }
}
