import type { AcceptLanguageHeader } from "composables/accept-language";

/** ステート識別子 */
const stateKey = "labels";

/** サイズ毎のラベル型 */
type SizedLabels = Record<string, string>;

/** ラベル型 */
type Labels = {
  long: SizedLabels;
  short: SizedLabels;
};

/** ラベル無し対応のプロキシハンドラ */
const proxyHandler = {
  get(target: SizedLabels, prop: any) {
    if (prop in target) {
      return target[prop];
    }
    if (typeof prop === "string" && prop.charAt(0) !== "_" && prop !== "toJSON") {
      return `NO LABEL (${prop})`;
    }
    return undefined;
  },
};

/** ラベルを取得 */
const getLabels = async (labels: Ref<Labels>, apiURL: string, acceptLanguageHeader: AcceptLanguageHeader) => {
  const { data, error } = await useFetch<Labels>("/labels", {
    baseURL: apiURL,
    headers: acceptLanguageHeader,
  });
  if (data.value && !error.value) {
    labels.value = {
      long: new Proxy(data.value.long, proxyHandler),
      short: new Proxy(data.value.short, proxyHandler),
    };
  } else {
    const message = error.value?.data?.message || error.value?.message || "LABEL GET ERROR";
    console.log(`useLabel#getLabels(): ${message}`);
  }
};

/** 言語変更を監視、ラベルを再取得 */
const startWatch = () => {
  const config = useAppConfig();
  const { acceptLanguageHeader } = useAcceptLanguage();
  const labels = useState<Labels>(stateKey);
  const stop = watch(acceptLanguageHeader, (value) => getLabels(labels, config.apiURL, value), {
    immediate: true,
    deep: false,
  });
  onScopeDispose(stop);
};

/** 初期空ラベル */
const initialEmptyLabels: Labels = {
  long: new Proxy({}, proxyHandler),
  short: new Proxy({}, proxyHandler),
};

/** ラベル */
export const useLabel = () => {
  const labels = useState<Labels>(stateKey, () => initialEmptyLabels);
  return {
    labels: readonly(labels),
    startWatch,
  };
};
