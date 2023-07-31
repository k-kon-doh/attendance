import { atom } from "jotai";

import { emptyAttendanceKinds, emptyAttendanceKindMap } from "@/api/attendance-kind";

/** 勤怠種別配列アトム */
export const attendanceKindsAtom = atom(emptyAttendanceKinds);

/** 勤怠種別マップアトム*/
export const attendanceKindMapAtom = atom(emptyAttendanceKindMap);
