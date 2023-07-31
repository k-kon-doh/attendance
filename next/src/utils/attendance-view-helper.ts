
import { emptyAttendance, Attendance } from "@/api/attendance";
import { AttendanceKindMap } from "@/api/attendance-kind";
import { CategoryMap } from "@/api/category";
import { Labels } from "@/api/label";
import Config from "@/app.config";

const StatusColors = ["primary", "secondary", "info", "success", "warning", "error",  "default"] as const satisfies readonly string[];
type StatusColorType = typeof StatusColors[number];
const isStatusColor = (value: string): value is StatusColorType => StatusColors.some((it) => it === value);

/** 勤怠情報表示用ヘルパー */
export default class AttendanceViewHelper {
  private labels: Labels;
  private categoryMap: CategoryMap;
  private attendanceKindMap: AttendanceKindMap;
  private attendance: Attendance;

  constructor(labels: Labels, categoryMap: CategoryMap, attendanceKindMap: AttendanceKindMap) {
    this.labels = labels;
    this.categoryMap = categoryMap;
    this.attendanceKindMap = attendanceKindMap;
    this.attendance = emptyAttendance;
  }

  setAttendance(attendance: Attendance) {
    this.attendance = attendance;
  }

  get selfAgent(): string {
    return (this.attendance?.agent.choiceId ? this.labels.short.agentApply : this.labels.short.selfApply) ?? "";
  }

  get statusColor(): StatusColorType {
    const value = Config.statusColor[Number(this.attendance?.status)] ?? "";
    return isStatusColor(value) ? value : "default";
  }

  get status(): string {
    return this.categoryMap.attendanceStatus.codeMap[this.attendance.status]?.name ?? "";
  }

  get subfamily(): string {
    return this.categoryMap.attendanceSubfamily.codeMap[this.attendance.subfamily]?.name ?? "";
  }

  get attendanceKind(): string {
    return this.attendanceKindMap[this.attendance.attendanceKindId]?.name ?? "";
  }

  get applicationDate(): string {
    return this.attendance.applicationDate ?? "";
  }

  get date(): string {
    if (this.attendance.endDate) {
      return `${this.attendance.beginDate}～${this.attendance.endDate}`;
    } else {
      return this.attendance.beginDate ?? "";
    }
  }

  get time(): string {
    if (this.attendance.beginTime && this.attendance.endTime) {
      return `${this.attendance.beginTime}～${this.attendance.endTime}`;
    } else if (this.attendance.beginTime) {
      return this.attendance.beginTime;
    } else if (this.attendance.endTime) {
      return `～${this.attendance.endTime}`;
    } else {
      return "";
    }
  }

  get reason(): string {
    if (this.attendance.reason.length < Config.truncateLength) {
      return this.attendance.reason;
    }
    return `${this.attendance.reason.substring(0, Config.truncateLength)}${Config.truncateSuffix}`;
  }

  get employee(): string {
    const numOfEmployees = this.attendance.employees.length;
    return numOfEmployees === 1 ? this.attendance.employees[0]!.name : `${numOfEmployees} ${this.labels.long.people}`;
  }
}
