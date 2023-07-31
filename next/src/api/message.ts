import { fetcher } from "@/api/fetcher";
import Config from "@/app.config";

/** メッセージ型 */
export type Messages = Record<string, string>;

/** 空のメッセージ */
export const emptyMessages: Messages = {} as const;

/** メッセージを取得 */
export async function fetchMessages(language: string) {
  return await fetcher<Messages>(`${Config.apiURL}/messages`, {
    cache: "no-store",
    headers: { "accept-language": language },
  }).then(
    (it) => it.data,
    () => emptyMessages
  );
}
