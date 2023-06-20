import type { AcceptLanguageHeader } from "composables/accept-language";

/** ステート識別子 */
const stateKey = "categories";

/** カテゴリーキーワード */
const keywords = ["attendanceExecution", "attendanceFamily", "attendanceStatus", "attendanceSubfamily", "feature", "necessary", "shift", "validity"] as const;

/** カテゴリーキーワード型 */
type Keyword = typeof keywords[number];

/** カテゴリーメンバー型 */
type CategoryMemnber = {
  keyword: Keyword;
  code: string;
  name: string;
  shortName: string;
  showOrder: number;
};

/** カテゴリー型 */
type Category = {
  codeMap: Record<string, CategoryMemnber>;
  members: CategoryMemnber[];
};

/** カテゴリーマップ型 */
export type CategoryMap = Record<Keyword, Category>;

/** 空カテゴリーマップの作成 */
const createEmptyCategoryMap = () => {
  const categoryMap: Partial<CategoryMap> = {};
  keywords.forEach((it) => (categoryMap[it] = { codeMap: {}, members: [] }));
  return categoryMap as CategoryMap;
};

/** カテゴリーを取得 */
const getCategories = async (categoryMap: Ref<CategoryMap>, apiURL: string, acceptLanguageHeader: AcceptLanguageHeader) => {
  const { data, error } = await useFetch<CategoryMemnber[]>("/categories", {
    baseURL: apiURL,
    headers: acceptLanguageHeader,
  });
  if (data.value && !error.value) {
    const newCategoryMap = createEmptyCategoryMap();
    data.value
      .filter((it) => it.keyword in newCategoryMap)
      .forEach((it) => {
        newCategoryMap[it.keyword].codeMap[it.code] = it;
        newCategoryMap[it.keyword].members.push(it);
      });
    categoryMap.value = newCategoryMap;
  } else {
    const message = error.value?.data?.message || error.value?.message || "CATEGORIY GET ERROR";
    console.log(`useCategory#getCategories(): ${message}`);
  }
};

/** 言語変更を監視、カテゴリーを再取得 */
const startWatch = () => {
  const config = useAppConfig();
  const { acceptLanguageHeader } = useAcceptLanguage();
  const categoryMap = useState<CategoryMap>(stateKey, () => createEmptyCategoryMap());
  const stop = watch(acceptLanguageHeader, (value) => getCategories(categoryMap, config.apiURL, value), {
    immediate: process.server,
    deep: false,
  });
  onScopeDispose(stop);
};

/** カテゴリー */
export const useCategory = () => {
  const categoryMap = useState<CategoryMap>(stateKey, () => createEmptyCategoryMap());
  return {
    categoryMap: readonly(categoryMap),
    startWatch,
  };
};
