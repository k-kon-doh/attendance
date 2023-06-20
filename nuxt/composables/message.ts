import type { AcceptLanguageHeader } from "composables/accept-language";

/** ステート識別子 */
const stateKey = "messages";

/** メッセージ型 */
type Messages = Record<string, string>;

/** メッセージ無し対応のプロキシハンドラ */
const proxyHandler = {
  get(target: Messages, prop: any) {
    if (prop in target) {
      return target[prop];
    }
    if (typeof prop === "string" && prop.charAt(0) !== "_" && prop !== "toJSON") {
      return `NO MESSAGE (${prop})`;
    }
    return undefined;
  },
};

/** メッセージを取得 */
const getMessages = async (messages: Ref<Messages>, apiURL: string, acceptLanguageHeader: AcceptLanguageHeader) => {
  const { data, error } = await useFetch<Messages>("/messages", {
    baseURL: apiURL,
    headers: acceptLanguageHeader,
  });
  if (data.value && !error.value) {
    messages.value = new Proxy(data.value, proxyHandler);
  } else {
    const message = error.value?.data?.message || error.value?.message || "MESSAGE GET ERROR";
    console.log(`useMessage#getMessages(): ${message}`);
  }
};

/** 言語変更を監視、メッセージを再取得 */
const startWatch = () => {
  const config = useAppConfig();
  const { acceptLanguageHeader } = useAcceptLanguage();
  const messages = useState<Messages>(stateKey);
  const stop = watch(acceptLanguageHeader, (value) => getMessages(messages, config.apiURL, value), {
    immediate: true,
    deep: false,
  });
  onScopeDispose(stop);
};

/** 初期空メッセージ */
const initialEmptyMessages: Messages = new Proxy({}, proxyHandler);

/** メッセージ */
export const useMessage = () => {
  const messages = useState<Messages>(stateKey, () => initialEmptyMessages);
  return {
    messages: readonly(messages),
    startWatch,
  };
};
