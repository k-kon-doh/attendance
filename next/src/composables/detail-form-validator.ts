import { ReadonlyAttendance } from "@/api/attendance";
import { AttendanceKind } from "@/api/attendance-kind";
import Config from "@/app.config";

/** 勤怠情報フォーム検証 */
export function validate(kind: AttendanceKind, attendance: ReadonlyAttendance) {
  if (!attendance.applicants.some((it) => it.choiceId && it.choice)) {
    return false;
  }
  if (kind.beginDate === Config.necessary.required && !attendance.beginDate) {
    return false;
  }
  if (kind.beginTime === Config.necessary.required && !attendance.beginTime) {
    return false;
  }
  if (kind.endDate === Config.necessary.required && !attendance.endDate) {
    return false;
  }
  if (kind.endTime === Config.necessary.required && !attendance.endTime) {
    return false;
  }
  if (kind.shift && !attendance.shift) {
    return false;
  }
  if (kind.reason && !attendance.reason) {
    return false;
  }
  if (!attendance.approver.choiceId) {
    return false;
  }
  return true;
}
