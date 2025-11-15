import { auth } from "@/worker/lib/auth";
import { Hono } from "hono";
import { inject, injectable } from "tsyringe";
import type { SeasonWordResponse } from "@/shared/types/season-word";
import { ContextProvider } from "@/worker/infrastructure/providers/ContextProvider";

@injectable()
export class WorkersController {
  controller = new Hono<{
    Bindings: Env;
    Variables: {
      user: typeof auth.$Infer.Session.user | null;
      session: typeof auth.$Infer.Session.session | null;
    };
  }>();

  constructor(
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
      .get("/ai", async (c) => {
        const ai = c.env.AI;
        const jpDate = new Date().toLocaleDateString("ja-JP", {
          year: "numeric",
          month: "long",
          day: "numeric",
        });
        const res = await ai.run("@cf/meta/llama-3.3-70b-instruct-fp8-fast", {
          messages: [
            {
              role: "system",
              content:
                "あなたは日本語の季語の専門家です。冗長な説明は不要。出力は必ずJSONで返すこと。",
            },
            {
              role: "user",
              content: `日本時間${jpDate}を前提に、季節を推定し、季語を3〜5語返して。`,
            },
          ],
          response_format: {
            type: "json_schema",
            json_schema: {
              json_schema: {
                type: "object",
                properties: {
                  timestamp_jst: { type: "string" },
                  season: { type: "string", enum: ["春", "夏", "秋", "冬"] },
                  sekki: { type: "string" },
                  kigo: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        word: { type: "string" },
                        reading: { type: "string" },
                        category: { type: "string" },
                        note: {
                          type: "string",
                          enum: ["春", "夏", "秋", "冬"],
                        },
                      },
                      required: ["word", "reading", "category"],
                    },
                  },
                },
                required: ["timestamp_jst", "season", "kigo"],
              },
            },
          },
          temperature: 0.7,
          top_p: 0.9,
        });

        if (typeof res === "object" && res !== null && "response" in res) {
          return c.json(res.response as unknown as SeasonWordResponse);
        }

        return c.json({ error: "Unexpected AI response format" }, 500);
      });
  }
}
