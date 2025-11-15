/**
 * 季語の型定義
 * Cloudflare AI の JSON Schema レスポンスと対応
 */

/**
 * 季節の列挙型
 */
export const SEASONS = ["春", "夏", "秋", "冬"] as const;
export type Season = (typeof SEASONS)[number];

/**
 * 個別の季語の型
 */
export type KigoItem = {
  word: string; // 季語
  reading: string; // 読み方
  category: string; // カテゴリ（例：「時候」「天文」「地理」など）
  note?: string; // 補足説明（オプショナル）
};

/**
 * 季語生成レスポンスの型
 * Cloudflare AI が返す JSON Schema に対応
 */
export type SeasonWordResponse = {
  timestamp_jst: string; // ISO 8601形式のJST日時
  season: Season; // 季節
  sekki?: string; // 二十四節気（オプショナル）
  kigo: KigoItem[]; // 季語の配列
};

/**
 * Cloudflare AI の実際のレスポンス型
 */
export type CloudflareAISeasonWordResponse = {
  response: string; // JSON文字列
  // その他のCloudflare AIメタデータがあればここに追加
};
