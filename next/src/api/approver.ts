import { fetcher } from "@/api/fetcher";
import Config from "@/app.config";

/** 承認候補者型 */
export type Approver = {
  hierarchy: number;
  organization: string;
  choiceId: string;
  name: string;
  choice: boolean;
};

/** 承認候補者を取得 */
export async function fetchApprover(language: string, csrfToken: string) {
  return await fetcher<Approver[]>(`${Config.apiURL}/approvers`, {
    cache: "no-store",
    method: "get",
    credentials: "include",
    headers: { "content-type": "application/json", "accept-language": language, "X-CSRF-Token": csrfToken },
  });
}
