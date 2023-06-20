import type { FetchError } from "ofetch";
import type { Criteria } from "composables/list-condition";

// 型指定が多数になると「error TS2321: Excessive stack depth comparing types...」 が発生する。
// import type { ExecutionValue, FeatureValue, ShiftValue, StatusValue, SubFamilyValue, ValidityValue } from "~/app.config";

/** 取得型 */
type FindType = "show" | "edit";

/** 社員型 */
export type Employee = {
  choiceId: string;
  name: string;
};

/** 候補者型 */
export type Applicant = {
  hierarchy: number;
  organization: string;
  choiceId: string;
  name: string;
  choice: boolean;
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

/** 新規勤怠情報を生成 */
const create = (immediate = false) => {
  const config = useAppConfig();
  const { resource } = useFeature();
  const { acceptLanguageHeader } = useAcceptLanguage();
  const { csrfTokenHeader, setToken } = useCsrfToken();
  const result = useAsyncData<Attendance, FetchError<any>>(
    "attendance-new",
    () =>
      $fetch(`/attendances/${resource.value}/new`, {
        baseURL: config.apiURL,
        method: "get",
        credentials: "include",
        headers: {
          ...acceptLanguageHeader.value,
          ...csrfTokenHeader.value,
        },
        onResponse({ response }) {
          setToken(response.headers.get("x-csrf-token") ?? "");
        },
      }),
    {
      immediate,
    }
  );
  result.pending.value = immediate;
  return result;
};

/** 勤怠情報リストを取得 */
const find = (criteria: Criteria | Ref<Criteria>, immediate = false) => {
  const config = useAppConfig();
  const { resource } = useFeature();
  const { acceptLanguageHeader } = useAcceptLanguage();
  const { csrfTokenHeader, setToken } = useCsrfToken();
  const result = useAsyncData<Attendance[], FetchError<any>>(
    "attendance-find",
    () =>
      $fetch(`/attendances/${resource.value}/search`, {
        baseURL: config.apiURL,
        method: "post",
        credentials: "include",
        headers: {
          ...acceptLanguageHeader.value,
          ...csrfTokenHeader.value,
        },
        body: {
          criteria: { ...unref(criteria) },
        },
        onResponse({ response }) {
          setToken(response.headers.get("x-csrf-token") ?? "");
        },
      }),
    {
      immediate,
    }
  );
  result.pending.value = immediate;
  return result;
};
/** 指定IDの勤怠情報を取得 */
const findById = (id: number | string | Ref<number | string>, findType: FindType = "show", immediate = false) => {
  const config = useAppConfig();
  const { resource } = useFeature();
  const { acceptLanguageHeader } = useAcceptLanguage();
  const { csrfTokenHeader, setToken } = useCsrfToken();
  const result = useAsyncData<Attendance, FetchError<any>>(
    "attendance-find-by-id",
    () =>
      $fetch(`/attendances/${resource.value}/${unref(id)}${findType === "show" ? "" : "/edit"}`, {
        baseURL: config.apiURL,
        method: "get",
        credentials: "include",
        headers: {
          ...acceptLanguageHeader.value,
          ...csrfTokenHeader.value,
        },
        onResponse({ response }) {
          setToken(response.headers.get("x-csrf-token") ?? "");
        },
      }),
    {
      immediate,
    }
  );
  result.pending.value = immediate;
  return result;
};

/** 勤怠情報を保存 */
const save = (attendance: Attendance | Ref<Attendance>, immediate = false) => {
  const config = useAppConfig();
  const { resource } = useFeature();
  const { acceptLanguageHeader } = useAcceptLanguage();
  const { csrfTokenHeader, setToken } = useCsrfToken();

  const result = useAsyncData<Attendance, FetchError<any>>(
    "attendance-save",
    () =>
      $fetch(`/attendances/${resource.value}${unref(attendance).id != null ? `/${unref(attendance).id}` : ""}`, {
        baseURL: config.apiURL,
        method: unref(attendance).id == null ? "post" : "put",
        credentials: "include",
        headers: {
          ...acceptLanguageHeader.value,
          ...csrfTokenHeader.value,
        },
        body: {
          attendance: { ...unref(attendance) },
        },
        onResponse({ response }) {
          setToken(response.headers.get("x-csrf-token") ?? "");
        },
      }),
    {
      immediate,
    }
  );
  result.pending.value = immediate;
  return result;
};

/** 勤怠情報 */
export const useAttendance = () => {
  return {
    create,
    find,
    findById,
    save,
  };
};
