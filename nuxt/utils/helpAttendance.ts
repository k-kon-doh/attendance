import { DeepReadonly } from "vue";
import { Attendance } from "composables/attendance";

const config = useAppConfig();
const { labels } = useLabel();
const { categoryMap } = useCategory();
const { attendanceKindMap } = useAttendanceKind();

/** 勤怠情報表示用ヘルパー */
class AttendanceViewHelper {
  private attendance: DeepReadonly<Attendance>;

  constructor(attendance: DeepReadonly<Attendance>) {
    this.attendance = attendance;
  }

  get selfAgent(): string {
    return (this.attendance.agent.choiceId ? labels.value.short.agentApply : labels.value.short.selfApply) ?? "";
  }

  get statusColor(): string {
    const value = Number(this.attendance.status);
    return config.statusColor[value] ?? "";
  }

  get status(): string {
    return categoryMap.value.attendanceStatus.codeMap[this.attendance.status]?.name ?? "";
  }

  get subfamily(): string {
    return categoryMap.value.attendanceSubfamily.codeMap[this.attendance.subfamily]?.name ?? "";
  }

  get attendanceKind(): string {
    return attendanceKindMap.value[this.attendance.attendanceKindId]?.name ?? "";
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
    if (this.attendance.reason.length < config.truncateLength) {
      return this.attendance.reason;
    }
    return `${this.attendance.reason.substring(0, config.truncateLength)}${config.truncateSuffix}`;
  }

  get employee(): string {
    const numOfEmployees = this.attendance.employees.length;
    return numOfEmployees === 1 ? this.attendance.employees[0]!.name : `${numOfEmployees} ${labels.value.long.people}`;
  }
}

/** 勤怠情報ユーティリティ */
export const helpAttendance = () => {
  return {
    helper: (attendance: DeepReadonly<Attendance>) => new AttendanceViewHelper(attendance),
  };
};
