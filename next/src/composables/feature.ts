import { proxy } from "valtio";

import Config, { FeatureValue } from "@/app.config";
import { DeepReadonly } from "@/composables/type-utils";

/** 機能ステート型 */
export type FeatureState = {
  value: FeatureValue;
};

const initialState: FeatureState = { value: Config.features.selfApply } as const;

/** 機能 */
export const featureState = proxy(initialState);

/** 初期化 */
export function initialize() {
  featureState.value = Config.features.selfApply;
}

/** 解析 */
export function analyze(state: DeepReadonly<FeatureState>) {
  return {
    isSelfApply: state.value === Config.features.selfApply,
    isApply: state.value === Config.features.selfApply || state.value === Config.features.representativeApply,
    isRepresentativeApply: state.value === Config.features.representativeApply,
    isApprove: state.value === Config.features.approve,
    isMasterMaintain: state.value === Config.features.masterMaintain,
  };
}

/* 下記の様にしてみたが、値が正しくない場合があり断念。
export type FeatureState = {
  isSelfApply: boolean;
  isRepresentativeApply: boolean;
  isApply: boolean;
  isApprove: boolean;
  isMasterMaintain: boolean;
} & StateType;
export const featureState: FeatureState = derive(
  {
    isSelfApply: (get) => get(state).value === Config.features.selfApply,
    isApply: (get) => get(state).value === Config.features.selfApply || get(state).value === Config.features.representativeApply,
    isRepresentativeApply: (get) => get(state).value === Config.features.representativeApply,
    isApprove: (get) => get(state).value === Config.features.approve,
    isMasterMaintain: (get) => get(state).value === Config.features.masterMaintain,
  },
  { proxy: state }
);
*/
