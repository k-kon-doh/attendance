import { useAtomValue } from "jotai";
import { useSnapshot } from "valtio";

import { Approver, fetchApprover } from "@/api/approver";
import { csrfTokenState } from "@/composables/csrf-token";
import { languageAtom } from "@/composables/language";

/** 承認候補者を取得 */
export default function useApprover() {
  const language = useAtomValue(languageAtom);
  const csrfToken = useSnapshot(csrfTokenState);

  const find = () =>
    fetchApprover(language, csrfToken.value).then<Approver[]>(
      (it) => {
        csrfTokenState.value = it.response.headers.get("x-csrf-token") ?? "";
        return it.data;
      },
      (error) => {
        csrfTokenState.value = "";
        throw error;
      }
    );

  return {
    find,
  };
}
