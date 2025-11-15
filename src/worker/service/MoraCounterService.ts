import { inject, injectable } from "tsyringe";
import type { IContextProvider } from "@/worker/domain/interface/providers/IContextProvider";

export interface IMoraCounterService {
  countMora(text: string): Promise<number>;
}

/**
 * 日本語テキストの音数（モーラ）をカウントするサービス
 *
 * モーラとは日本語の音の単位で、基本的に：
 * - ひらがな・カタカナ1文字 = 1モーラ
 * - 小文字（ゃ、ゅ、ょ、っ など）= 前の文字と合わせて1モーラ
 * - 長音記号「ー」= 1モーラ
 * - 撥音「ん」= 1モーラ
 */
@injectable()
export class MoraCounterService implements IMoraCounterService {
  constructor(
    @inject("IContextProvider")
    private readonly contextProvider: IContextProvider
  ) {}

  /**
   * テキストの音数をカウント
   * 漢字が含まれる場合、AIで読みを取得してからカウント
   */
  async countMora(text: string): Promise<number> {
    // 漢字が含まれる場合、読みを取得
    const kanaText = await this.convertToKana(text);

    // かな文字列の音数をカウント
    return this.countKanaMora(kanaText);
  }

  /**
   * テキストを読み仮名に変換
   */
  private async convertToKana(text: string): Promise<string> {
    // 既にひらがな・カタカナのみの場合はそのまま返す
    if (this.isKanaOnly(text)) {
      return text;
    }

    try {
      const ai = this.contextProvider.getAiContext();
      const response = await ai.run(
        "@cf/meta/llama-3.3-70b-instruct-fp8-fast",
        {
          messages: [
            {
              role: "system",
              content:
                "あなたは日本語の読み仮名変換の専門家です。入力されたテキストを全てひらがなの読み仮名に変換してください。読み仮名のみを出力し、他の説明は一切含めないでください。",
            },
            {
              role: "user",
              content: `次のテキストをひらがなの読み仮名に変換してください：${text}`,
            },
          ],
          temperature: 0.1,
          max_tokens: 100,
        }
      );

      // AIレスポンスから読み仮名を抽出
      const kana = this.extractKanaFromResponse(response);

      // 変換に失敗した場合は元のテキストを返す
      return kana || text;
    } catch (error) {
      console.error("Failed to convert to kana:", error);
      // エラー時は元のテキストを返す（フォールバック）
      return text;
    }
  }

  /**
   * AIレスポンスから読み仮名を抽出
   */
  private extractKanaFromResponse(response: unknown): string {
    if (
      typeof response === "object" &&
      response !== null &&
      "response" in response
    ) {
      const responseText = String(response.response).trim();
      // 余分な説明を除去し、ひらがなのみを抽出
      const kanaMatch = responseText.match(/[ぁ-ん]+/);
      return kanaMatch ? kanaMatch[0] : responseText;
    }
    return "";
  }

  /**
   * テキストがひらがな・カタカナのみかチェック
   */
  private isKanaOnly(text: string): boolean {
    // ひらがな、カタカナ、長音記号、中点のみの場合true
    return /^[ぁ-んァ-ヶー・]+$/.test(text);
  }

  /**
   * かな文字列の音数をカウント
   */
  private countKanaMora(kanaText: string): number {
    let count = 0;
    const chars = Array.from(kanaText);

    for (let i = 0; i < chars.length; i++) {
      const char = chars[i];

      // 小文字（拗音・促音）はカウントしない（前の文字と合わせて1モーラ）
      if (this.isSmallKana(char)) {
        continue;
      }

      // 長音記号は1モーラとしてカウント
      if (char === "ー") {
        count++;
        continue;
      }

      // 通常の文字は1モーラ
      if (this.isKana(char)) {
        count++;
      }
    }

    return count;
  }

  /**
   * 小文字のかな（拗音・促音）判定
   */
  private isSmallKana(char: string): boolean {
    const smallKana = [
      "ぁ",
      "ぃ",
      "ぅ",
      "ぇ",
      "ぉ",
      "ゃ",
      "ゅ",
      "ょ",
      "ゎ",
      "っ",
      "ァ",
      "ィ",
      "ゥ",
      "ェ",
      "ォ",
      "ャ",
      "ュ",
      "ョ",
      "ヮ",
      "ッ",
    ];
    return smallKana.includes(char);
  }

  /**
   * かな文字判定
   */
  private isKana(char: string): boolean {
    const code = char.charCodeAt(0);
    // ひらがな (U+3040-U+309F) またはカタカナ (U+30A0-U+30FF)
    return (
      (code >= 0x3040 && code <= 0x309f) || (code >= 0x30a0 && code <= 0x30ff)
    );
  }
}
