import type { AcceptLanguageHeader } from "composables/accept-language";
import type { FamilyValue, NecessaryValue } from "~/app.config";

/** ステート識別子：種別配列 */
const stateKindsKey = "attendanceKinds";

/** ステート識別子：ID・種別マップ */
const stateKindMapKey = "attendanceKindMap";

/** 勤怠種別型 */
export type AttendanceKind = {
  id: number;
  name: string;
  shortName: string;
  family: FamilyValue;
  beginDate: NecessaryValue;
  beginTime: NecessaryValue;
  endDate: NecessaryValue;
  endTime: NecessaryValue;
  shift: boolean;
  reason: boolean;
  showOrder: number;
  validity: boolean;
};

/** ID・種別マップ型 */
export type AttendanceKindMap = Record<number, AttendanceKind>;

/** 勤怠種別を取得 */
const getAttendanceKinds = async (
  attendanceKinds: Ref<AttendanceKind[]>,
  attendanceKindMap: Ref<AttendanceKindMap>,
  apiURL: string,
  acceptLanguageHeader: AcceptLanguageHeader
) => {
  const { data, error } = await useFetch<AttendanceKind[]>("/attendance_kinds", {
    baseURL: apiURL,
    headers: acceptLanguageHeader,
  });
  if (data.value && !error.value) {
    attendanceKinds.value = data.value;
    const map: AttendanceKindMap = {};
    data.value.forEach((it) => (map[it.id] = it));
    attendanceKindMap.value = map;
  } else {
    const message = error.value?.data?.message || error.value?.message || "NO ATTENDANCE KIND GET ERROR";
    console.log(`useAttendanceKind#getAttendanceKinds(): ${message}`);
  }
};

/** 言語変更を監視、勤怠種別を再取得 */
const startWatch = () => {
  const config = useAppConfig();
  const { acceptLanguageHeader } = useAcceptLanguage();
  const attendanceKinds = useState<AttendanceKind[]>(stateKindsKey);
  const attendanceKindMap = useState<AttendanceKindMap>(stateKindMapKey);
  const stop = watch(acceptLanguageHeader, (value) => getAttendanceKinds(attendanceKinds, attendanceKindMap, config.apiURL, value), {
    immediate: process.server,
    deep: false,
  });
  onScopeDispose(stop);
};

/** 勤怠種別 */
export const useAttendanceKind = () => {
  const attendanceKinds = useState<AttendanceKind[]>(stateKindsKey, () => []);
  const attendanceKindMap = useState<AttendanceKindMap>(stateKindMapKey, () => ({}));
  return {
    attendanceKinds: readonly(attendanceKinds),
    attendanceKindMap: readonly(attendanceKindMap),
    startWatch,
  };
};
