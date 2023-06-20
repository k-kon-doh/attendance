import type { FetchError } from "ofetch";

/** 候補者型 */
export type Approver = {
  hierarchy: number;
  organization: string;
  choiceId: string;
  name: string;
  choice: boolean;
};

/** 承認候補者リストを取得 */
export const useApprover = (immediate = false) => {
  const config = useAppConfig();
  const { acceptLanguageHeader } = useAcceptLanguage();
  const { csrfTokenHeader, setToken } = useCsrfToken();
  const result = useAsyncData<Approver[], FetchError<any>>(
    "approver-find",
    () =>
      $fetch(`/approvers`, {
        baseURL: config.apiURL,
        method: "get",
        credentials: "include",
        headers: {
          ...acceptLanguageHeader.value,
          ...csrfTokenHeader.value,
        },
        onResponse({ response }) {
          setToken(response.headers.get("x-csrf-token") ?? "");
        },
      }),
    {
      immediate,
    }
  );
  result.pending.value = immediate;
  return result;
};
