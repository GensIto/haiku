import { auth } from "@/worker/lib/auth";
import { Context } from "hono";

export interface IContextProvider {
  setContext(
    context: Context<{
      Bindings: Env;
      Variables: {
        user: typeof auth.$Infer.Session.user | null;
        session: typeof auth.$Infer.Session.session | null;
      };
    }>
  ): void;
  getAiContext(): Ai;
}
