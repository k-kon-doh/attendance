/** ステート識別子 */
const stateKey = "primary-language";

/** 既定言語 */
const defaultLanguage = "*";

/** 許容言語ヘッダー型 */
export type AcceptLanguageHeader = { "accept-language": string };

/** 第一言語を 「リクエスト」または「ブラウザの言語」から取得 */
const getPrimaryLanguage = () => {
  let primaryLanguage = defaultLanguage;
  if (process.server) {
    const acceptLanguage = useRequestHeaders(["accept-language"])["accept-language"];
    if (acceptLanguage) {
      primaryLanguage = acceptLanguage.split(/[,;]/, 1)[0] || defaultLanguage;
    }
  }
  if (process.client && navigator.languages.length) {
    primaryLanguage = navigator.languages[0] || defaultLanguage;
  }
  useState<string>(stateKey).value = primaryLanguage;
};

/** 許容言語 */
export const useAcceptLanguage = () => {
  const primaryLanguage = useState<string>(stateKey, () => defaultLanguage);
  getPrimaryLanguage();
  return {
    primaryLanguage: readonly(primaryLanguage),
    acceptLanguageHeader: computed<AcceptLanguageHeader>(() => ({
      "accept-language": primaryLanguage.value,
    })),
    getPrimaryLanguage,
  };
};
