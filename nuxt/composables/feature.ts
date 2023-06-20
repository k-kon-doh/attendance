import type { FeatureValue } from "~/app.config";

/** ステート識別子 */
const stateKey = "current-feature";

/** 初期値 */
const defaultFeature = useAppConfig().features.selfApply;

/** 初期化 */
const initialize = () => {
  useState<FeatureValue>(stateKey).value = defaultFeature;
};

/** 機能 */
export const useFeature = () => {
  const config = useAppConfig();
  const feature = useState<FeatureValue>(stateKey, () => defaultFeature);
  const { register } = useCleaner();
  register(stateKey, initialize);
  return {
    feature,
    resource: computed(() => config.resources[feature.value]),
  };
};
