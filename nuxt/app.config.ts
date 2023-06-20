/** 有効/無効 */
const validity = {
  invalid: "0",
  valid: "1",
} as const;
export type ValidityValue = typeof validity[keyof typeof validity];

/** 項目の必要性 */
const necessary = {
  notNeeded: "0",
  required: "1",
  optional: "2",
} as const;
export type NecessaryValue = typeof necessary[keyof typeof necessary];

/** 実施状態 */
const execution = {
  notYet: "0",
  done: "1",
} as const;
export type ExecutionValue = typeof execution[keyof typeof execution];

/** 勤務形態 */
const shift = {
  unknown: "",
  day: "1",
  night: "2",
  two: "3",
  three: "4",
} as const;
export type ShiftValue = typeof shift[keyof typeof shift];

/** 機能 */
const features = {
  selfApply: "1",
  representativeApply: "2",
  approve: "3",
  masterMaintain: "4",
} as const;
export type FeatureValue = typeof features[keyof typeof features];

/** 機能: リソース(URL) */
const resources = {
  1: "self",
  2: "representative",
  3: "approval",
  4: "masterMaintain",
} as const;

/** 機能： 一覧リスト項目 */
const featureListItemsMap = {
  1: ["status", "selfAgent", "attendanceKind", "subfamily", "date", "time", "reason", "applicationDate"],
  2: ["status", "attendanceKind", "subfamily", "employee", "date", "time", "applicationDate"],
  3: ["status", "attendanceKind", "subfamily", "employee", "date", "time", "applicationDate"],
  4: [],
} as const;

/** 申請状態 */
const status = {
  making: "1",
  applying: "2",
  accepted: "3",
  rejected: "4",
} as const;
export type StatusValue = typeof status[keyof typeof status];

/** 申請状態: カラー */
const statusColor: Record<number, string> = {
  1: "warning",
  2: "info",
  3: "success",
  4: "error",
} as const;

/** 申請種類 */
const family = {
  solo: "1",
  planAndResult: "2",
} as const;
export type FamilyValue = typeof family[keyof typeof family];

/** 申請種類詳細 */
const subfamily = {
  solo: "1",
  plan: "2",
  result: "3",
} as const;
export type SubFamilyValue = typeof subfamily[keyof typeof subfamily];

/** 申請種類:  申請種類詳細 */
const subfamilyMap = {
  1: ["1"],
  2: ["2", "3"],
} as const;

/** アプリケーション設定 */
export default defineAppConfig({
  apiURL: "http://localhost:3001/api/v1",
  flashTimeout: {
    success: 1500,
    info: 1500,
    warning: 2500,
    error: 2500,
  },
  truncateLength: 5,
  truncateSuffix: "...",
  maxReasonLength: 100,
  maxCommentLength: 100,
  maxTime: {
    hour: "47",
    minute: "59",
  },
  errorMark: "* ",
  dateDelimiter: "-",
  dateDelimiters: "-/",
  timeDelimiter: ":",
  validity: { ...validity },
  necessary: { ...necessary },
  execution: { ...execution },
  shift: { ...shift },
  features: { ...features },
  resources: { ...resources },
  featureListItemsMap: { ...featureListItemsMap },
  status: { ...status },
  statusColor: { ...statusColor },
  family: { ...family },
  subfamily: { ...subfamily },
  subfamilyMap: { ...subfamilyMap },
});
