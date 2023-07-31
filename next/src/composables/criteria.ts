"use client";

import { proxy } from "valtio";

import Config, { FeatureValue } from "@/app.config";

/** 検索条件型 */
export type Criteria = {
  status: string;
  kind: string;
  date: string | null;
  applicationDate: string | null;
};

/** 機能毎の検索条件マップ型 */
type CriteriaMap = {
  [key in FeatureValue]: Criteria;
};

/** 指定機能の検索条件を作成 */
const createCriteria = (feature: FeatureValue = Config.features.selfApply): Criteria => ({
  status: feature === Config.features.approve ? Config.status.applying : "",
  kind: "",
  date: null,
  applicationDate: null,
});

/** 初期検索条件マップを作成 */
const createInitialCriteriaMap = () => {
  const criteriaMap: Partial<CriteriaMap> = {};
  Object.values(Config.features).map((value: FeatureValue) => {
    criteriaMap[value] = createCriteria(value);
  });
  return criteriaMap as CriteriaMap;
};

/** 初期検索条件 */
const initialCriteria = createCriteria();

/** 初期検索条件マップ*/
const initialCriteriaMap = createInitialCriteriaMap();

/** 状態管理： 検索条件マップ */
export const criteriaMapState = proxy(initialCriteriaMap);

/** 状態管理： カレント検索条件 */
export const currentCriteriaState = proxy(initialCriteria);

/** カレント検索条件をクリア */
export const clear = (feature: FeatureValue) => {
  Object.assign(currentCriteriaState, initialCriteriaMap[feature]);
};

/** 検索条件マップから指定機能の検索条件をカレント検索条件へロード */
export const load = (feature: FeatureValue) => {
  Object.assign(currentCriteriaState, criteriaMapState[feature]);
};

/** カレント検索条件を検索条件マップへ保存 */
export const save = (feature: FeatureValue) => {
  Object.assign(criteriaMapState[feature], currentCriteriaState);
};

/** 初期化 */
export function initialize() {
  Object.assign(currentCriteriaState, initialCriteria);
  Object.values(Config.features).map((value: FeatureValue) => {
    Object.assign(criteriaMapState[value], initialCriteriaMap[value]);
  });
}
