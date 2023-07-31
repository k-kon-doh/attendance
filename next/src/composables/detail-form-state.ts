import { proxy } from "valtio";

import { Attendance, emptyAttendance } from "@/api/attendance";

/** 詳細フォームステート型 */
export type DetailFormState = {
  attendance: Attendance;
};

/** ステート初期値 */
const initialState: DetailFormState = { attendance: emptyAttendance } as const;

/** 詳細フォームステート */
export const detailFormState = proxy(initialState);
