import "reflect-metadata";

import { Hono } from "hono";
import { auth } from "./lib/auth";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { UsersController } from "@/worker/controllers/users";
import { container } from "tsyringe";
import "@/worker/containers";
import { VersesController } from "@/worker/controllers/verses";
import { DangosController } from "@/worker/controllers/dangos";
import { WorkersController } from "@/worker/controllers/workers";

const app = new Hono<{ Bindings: Env }>().basePath("/api");

app.use("*", cors({ origin: "*" }));
app.use(logger());

const usersController = container.resolve(UsersController);
const versesController = container.resolve(VersesController);
const dangosController = container.resolve(DangosController);
const workersController = container.resolve(WorkersController);

const route = app
  .get("/", (c) => c.json({ name: "Cloudflare" }))
  .get("/hello", async (c) => {
    return c.json({ message: "Hello World" });
  })
  .on(["POST", "GET"], "/auth/*", (c) => auth.handler(c.req.raw))
  .route("/users", usersController.routes())
  .route("/verses", versesController.routes())
  .route("/dangos", dangosController.routes())
  .route("/workers", workersController.routes());
export default route;
export type AppType = typeof route;
