import { fetcher } from "@/api/fetcher";
import Config from "@/app.config";

/** サイズ毎のラベル型 */
export type SizedLabels = Record<string, string>;

/** ラベル型 */
export type Labels = {
  long: SizedLabels;
  short: SizedLabels;
};

/** 空のラベル */
export const emptyLabels: Labels = {
  long: {},
  short: {},
} as const;

/** ラベルを取得 */
export async function fetchLabels(language: string) {
  return await fetcher<Labels>(`${Config.apiURL}/labels`, {
    cache: "no-store",
    headers: { "accept-language": language },
  }).then(
    (it) => it.data,
    () => emptyLabels
  );
}
