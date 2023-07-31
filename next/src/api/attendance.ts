import { fetcher } from "@/api/fetcher";
import Config from "@/app.config";
import { Criteria } from "@/composables/criteria";
import { DeepReadonly } from "@/composables/type-utils";

// 型指定が多数になると「error TS2321: Excessive stack depth comparing types...」 が発生する。
// import type { ExecutionValue, FeatureValue, ShiftValue, StatusValue, SubFamilyValue, ValidityValue } from "@/app.config";

/** 取得情報型 */
export type FindType = "show" | "edit";

/** 社員型 */
export type Employee = {
  choiceId: string;
  name: string;
};

/** 勤怠対象候補者型 */
export type Applicant = {
  hierarchy: number;
  organization: string;
  choiceId: string;
  name: string;
  choice: boolean;
};

/** 勤怠対象候補者選択型 */
export type ChoiceMap = {
  [chiceId: string]: boolean;
};

// JSONに日付型の定義がないので文字列として扱ってます。
/** 勤怠情報型 */
export type Attendance = {
  id: number | null;
  attendanceKindId: number;
  status: string; // StatusValue;
  subfamily: string; // SubFamilyValue;
  execution: string; // ExecutionValue;
  beginDate: string | null;
  beginTime: string;
  endDate: string | null;
  endTime: string;
  shift: string; // ShiftValue;
  reason: string;
  applicationDate: string | null;
  agent: Employee;
  approver: Employee;
  approvalDate: string | null;
  approvalComment: string;
  relatedId: number | null;
  validity: string; // ValidityValue;
  lockVersion: number;
  employees: Employee[];
  applicants: Applicant[];
};

/** 読み取り専用勤怠情報型 */
export type ReadonlyAttendance = DeepReadonly<Attendance>;

/** 空勤怠情報 */
export const emptyAttendance: Attendance = {
  id: null,
  attendanceKindId: 5,
  status: "1",
  subfamily: "2",
  execution: "0",
  beginDate: null,
  beginTime: "",
  endDate: null,
  endTime: "",
  shift: "",
  reason: "",
  applicationDate: null,
  agent: { choiceId: "", name: "" } as Attendance["agent"],
  approver: { choiceId: "", name: "" } as Attendance["approver"],
  approvalDate: null,
  approvalComment: "",
  relatedId: null,
  validity: "1",
  lockVersion: 0,
  employees: [] as Attendance["employees"],
  applicants: [] as Attendance["applicants"],
} as const;

/** 新規勤怠情報を取得 */
export async function create(language: string, csrfToken: string, resource: string) {
  return await fetcher<Attendance>(`${Config.apiURL}/attendances/${resource}/new`, {
    cache: "no-store",
    method: "get",
    credentials: "include",
    headers: { "content-type": "application/json", "accept-language": language, "X-CSRF-Token": csrfToken },
  });
}

/** 指定IDの勤怠情報を取得 */
export async function findById(language: string, csrfToken: string, resource: string, id: number, findType: FindType) {
  return await fetcher<Attendance>(`${Config.apiURL}/attendances/${resource}/${id}${findType === "show" ? "" : "/edit"}`, {
    cache: "no-store",
    method: "get",
    credentials: "include",
    headers: { "content-type": "application/json", "accept-language": language, "X-CSRF-Token": csrfToken },
  });
}

/** 勤怠情報リストを取得 */
export async function find(language: string, csrfToken: string, resource: string, criteria: Criteria) {
  return await fetcher<Attendance[]>(`${Config.apiURL}/attendances/${resource}/search`, {
    cache: "no-store",
    method: "post",
    credentials: "include",
    headers: { "content-type": "application/json", "accept-language": language, "X-CSRF-Token": csrfToken },
    body: JSON.stringify({
      criteria,
    }),
  });
}

/**  勤怠情報を保存 */
export async function save(language: string, csrfToken: string, resource: string, attendance: Attendance) {
  return await fetcher<Attendance>(`${Config.apiURL}/attendances/${resource}${attendance.id == null ? "" : `/${attendance.id}`}`, {
    cache: "no-store",
    method: attendance.id == null ? "post" : "put",
    credentials: "include",
    headers: { "content-type": "application/json", "accept-language": language, "X-CSRF-Token": csrfToken },
    body: JSON.stringify({
      attendance,
    }),
  });
}
