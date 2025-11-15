import { IContextProvider } from "@/worker/domain/interface/providers/IContextProvider";
import { auth } from "@/worker/lib/auth";
import { Context } from "hono";
import { injectable } from "tsyringe";

@injectable()
export class ContextProvider implements IContextProvider {
  private context: Context<{
    Bindings: Env;
    Variables: {
      user: typeof auth.$Infer.Session.user | null;
      session: typeof auth.$Infer.Session.session | null;
    };
  }> | null = null;

  setContext(
    context: Context<{
      Bindings: Env;
      Variables: {
        user: typeof auth.$Infer.Session.user | null;
        session: typeof auth.$Infer.Session.session | null;
      };
    }>
  ): void {
    this.context = context;
  }

  getAiContext() {
    if (!this.context) {
      throw new Error("Context not set. Call setContext() first.");
    }

    const aiContext = this.context.env.AI;
    if (!aiContext) {
      throw new Error("AI_CONTEXT not found in environment variables");
    }

    return aiContext;
  }
}
