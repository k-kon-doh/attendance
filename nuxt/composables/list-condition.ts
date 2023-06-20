import type { FeatureValue } from "~/app.config";

// TODO:（今は、時間がないので妥協）
// 検索項目は、機能毎に検討が必要。
// 日付と申請日は、期間（開始日～終了日）にしたほうが良い。

/** 検索条件型 */
export type Criteria = {
  status: string;
  kind: string;
  date: string | null;
  applicationDate: string | null;
};
/** 初期検索条件を作成 */
export const createListInitialCriteria = () => {
  const { feature } = useFeature();
  return createListCriteria(feature.value);
};

/** 指定機能の検索条件を作成 */
const createListCriteria = (feature: FeatureValue) => {
  const criteria = {
    status: "",
    kind: "",
    date: null,
    applicationDate: null,
  };
  const config = useAppConfig();
  if (feature === config.features.approve) {
    criteria.status = config.status.applying;
  }
  return criteria;
};

/** 勤怠情報リストのコンディション(検索条件，スクロール位置) */
export const useListCondition = (feature: FeatureValue | Ref<FeatureValue>) => {
  const isolatedFeature = unref(feature);
  const criteria = useState<Criteria>(`attendance-list-criteria-${isolatedFeature}`, () => shallowRef(createListCriteria(isolatedFeature)));
  const scrollPosition = useState<number>(`attendance-list-scroll-position-${isolatedFeature}`, () => 0);
  const { register } = useCleaner();
  register(`attendance-list-criteria-${isolatedFeature}`, () => (criteria.value = createListCriteria(isolatedFeature)));
  register(`attendance-list-scroll-position-${isolatedFeature}`, () => (scrollPosition.value = 0));
  return {
    criteria,
    scrollPosition,
  };
};
