import { IKigoDetectionService } from "@/worker/domain/interface/service/KigoDetectionService";
import { ContextProvider } from "@/worker/infrastructure/providers/ContextProvider";
import { inject, injectable } from "tsyringe";

@injectable()
export class KigoDetectionService implements IKigoDetectionService {
  constructor(
    @inject("IContextProvider") private contextProvider: ContextProvider
  ) {}

  async detectKigo(text: string): Promise<boolean> {
    const ai = this.contextProvider.getAiContext();

    const jpDate = new Date().toLocaleDateString("ja-JP", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    const prompt = `日本時間${jpDate}を前提に、「${text}」に相応しい季語はありますか?。`;

    const ragRes = await ai.autorag("haiku-kigo-search").aiSearch({
      query: prompt,
    });
    const resLlama = await ai.run("@cf/meta/llama-3.3-70b-instruct-fp8-fast", {
      messages: [
        {
          role: "system",
          content:
            "あなたは日本語の季語の専門家です。冗長な説明は不要。出力は必ずJSONで返すこと。",
        },
        {
          role: "user",
          content: `${ragRes.response}の文脈から季語が含まれているか判定してください。含まれている場合はtrue、含まれていない場合はfalseを返してください。`,
        },
      ],
      response_format: {
        type: "json_schema",
        json_schema: {
          json_schema: {
            type: "object",
            properties: {
              containsKigo: { type: "boolean" },
            },
            required: ["containsKigo"],
          },
        },
      },
      temperature: 0.7,
      top_p: 0.9,
    });

    if (
      typeof resLlama === "object" &&
      resLlama !== null &&
      "response" in resLlama
    ) {
      const containsKigo = resLlama.response as unknown as {
        containsKigo: boolean;
      };
      if (!containsKigo.containsKigo) return false;
      return true;
    } else {
      return false;
    }
  }
}
