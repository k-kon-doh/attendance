import { fetcher } from "@/api/fetcher";
import Config from "@/app.config";

/** カテゴリーキーワード */
export const keywords = [
  "attendanceExecution",
  "attendanceFamily",
  "attendanceStatus",
  "attendanceSubfamily",
  "feature",
  "necessary",
  "shift",
  "validity",
] as const;

/** カテゴリーキーワード型 */
export type Keyword = typeof keywords[number];

/** カテゴリーメンバー型 */
export type CategoryMemnber = {
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

/** 空のカテゴリーマップの作成 */
export const createEmptyCategoryMap = () => {
  const categoryMap: Partial<CategoryMap> = {};
  keywords.forEach((it) => (categoryMap[it] = { codeMap: {}, members: [] }));
  return categoryMap as CategoryMap;
};

/** 空のカテゴリーメンバー */
const emptyCategoryMemnbers: CategoryMemnber[] = [];

/** 空のカテゴリーマップ */
export const emptyCategoryMap = createEmptyCategoryMap();

/** カテゴリーマップを取得 */
export async function fetchCategoryMap(language: string) {
  const data = await fetcher<CategoryMemnber[]>(`${Config.apiURL}/categories`, {
    cache: "no-store",
    headers: { "accept-language": language },
  }).then(
    (it) => it.data,
    () => emptyCategoryMemnbers
  );
  const categoryMap = createEmptyCategoryMap();
  data
    .filter((it) => it.keyword in categoryMap)
    .forEach((it) => {
      categoryMap[it.keyword].codeMap[it.code] = it;
      categoryMap[it.keyword].members.push(it);
    });
  return categoryMap;
}
