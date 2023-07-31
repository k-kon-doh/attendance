import { fetcher } from "@/api/fetcher";
import Config from "@/app.config";

import type { FamilyValue, NecessaryValue } from "@/app.config";

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

/** ID・勤怠種別マップ型 */
export type AttendanceKindMap = Record<AttendanceKind["id"], AttendanceKind>;

/** 空の勤怠種別 */
export const emptyAttendanceKinds: AttendanceKind[] = [];

/** 空のID・勤怠種別マップ */
export const emptyAttendanceKindMap: AttendanceKindMap = {};

/** 勤怠種別を取得 */
export async function fetchAttendanceKinds(language: string): Promise<[AttendanceKind[], AttendanceKindMap]> {
  const data = await fetcher<AttendanceKind[]>(`${Config.apiURL}/attendance_kinds`, {
    cache: "no-store",
    headers: { "accept-language": language },
  }).then(
    (it) => it.data,
    () => emptyAttendanceKinds
  );
  const attendanceKindMap: AttendanceKindMap = {};
  data.forEach((it) => (attendanceKindMap[it.id] = it));
  return [data, attendanceKindMap];
}
