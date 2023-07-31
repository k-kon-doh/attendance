"use client";

import { Card } from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2";
import { useAtomValue } from "jotai";
import { memo, useCallback, useEffect, useMemo, useRef } from "react";
import { useSnapshot } from "valtio";

import { Attendance, ChoiceMap, Employee, ReadonlyAttendance, emptyAttendance } from "@/api/attendance";
import Loading from "@/app/loading";
import Config from "@/app.config";
import Agent from "@/components/attendance/parts/agent";
import ApplicationDate from "@/components/attendance/parts/application-date";
import ApprovalComment from "@/components/attendance/parts/approval-comment";
import ApprovalDate from "@/components/attendance/parts/approval-date";
import ApproverSelector from "@/components/attendance/parts/approver-selector";
import BeginDate from "@/components/attendance/parts/begin-date";
import BeginTime from "@/components/attendance/parts/begin-time";
import { CreateElementFunction } from "@/components/attendance/parts/detail-form-action";
import EndDate from "@/components/attendance/parts/end-date";
import EndTime from "@/components/attendance/parts/end-time";
import ExecutionSelector from "@/components/attendance/parts/execution-selector";
import KindSubfamilySelector from "@/components/attendance/parts/kind-subfamily-selector";
import MemberSelector from "@/components/attendance/parts/member-selector";
import Reason from "@/components/attendance/parts/reason";
import ShiftSelector from "@/components/attendance/parts/shift-selector";
import StatusSelector from "@/components/attendance/parts/status-selector";
import { analyze as analyzeAttendance } from "@/composables/attendance-analyzer";
import { attendanceKindMapAtom } from "@/composables/attendance-kind";
import { currentEmployeeState } from "@/composables/authenticate";
import { detailFormState } from "@/composables/detail-form-state";
import { validate } from "@/composables/detail-form-validator";
import { analyze as analyzeFeature, featureState } from "@/composables/feature";
import { messagesAtom } from "@/composables/message";

function mutableClone(attendance: ReadonlyAttendance): Attendance {
  return JSON.parse(JSON.stringify(attendance));
}

/** 勤怠情報詳細フォームのプロパティ型 */
type DetailFormProps = {
  createActionElement: CreateElementFunction;
  value: Attendance;
};

/** 勤怠情報詳細フォーム */
function DetailForm({ createActionElement, value }: DetailFormProps) {
  const ready = useRef(false);
  const messages = useAtomValue(messagesAtom);
  const attendanceKindMap = useAtomValue(attendanceKindMapAtom);

  const feature = useSnapshot(featureState);
  const featureSpec = useMemo(() => analyzeFeature(feature), [feature]);

  const currentEmployee = useSnapshot(currentEmployeeState);

  const attendance = useSnapshot(detailFormState).attendance;
  const attendanceSpec = useMemo(() => analyzeAttendance(attendance, feature, currentEmployee), [attendance, currentEmployee, feature]);

  const kind = useMemo(() => attendanceKindMap[attendance.attendanceKindId]!, [attendanceKindMap, attendance.attendanceKindId]);
  const dateRange = useMemo(() => kind.endDate !== Config.necessary.notNeeded, [kind.endDate]);
  const timeRange = useMemo(() => kind.endTime !== Config.necessary.notNeeded, [kind.endTime]);

  const dateErrorMessage = useMemo(
    () => (dateRange && attendance.beginDate && attendance.endDate && attendance.endDate <= attendance.beginDate ? messages.reversedDate! : ""),
    [dateRange, messages.reversedDate, attendance.beginDate, attendance.endDate]
  );
  const timeErrorMessage = useMemo(
    () => (timeRange && attendance.beginTime && attendance.endTime && attendance.endTime <= attendance.beginTime ? messages.reversedTime! : ""),
    [messages.reversedTime, attendance.beginTime, attendance.endTime, timeRange]
  );

  const valid = useMemo(
    () => validate(kind, attendance) && !dateErrorMessage && !timeErrorMessage,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [dateErrorMessage, JSON.stringify(kind), JSON.stringify(attendance), timeErrorMessage]
  );

  const memberHandler = useCallback((value: ChoiceMap) => {
    detailFormState.attendance.applicants.forEach((it) => {
      if (it.choiceId) {
        it.choice = value[it.choiceId] ?? false;
      }
    });
  }, []);
  const statusHandler = useCallback((value: string) => (detailFormState.attendance.status = value), []);
  const kindHandler = useCallback((value: number) => (detailFormState.attendance.attendanceKindId = value), []);
  const subfamilyHandler = useCallback((value: string) => (detailFormState.attendance.subfamily = value), []);
  const executionHandler = useCallback((value: string) => (detailFormState.attendance.execution = value), []);
  const beginDateHandler = useCallback((value: string) => (detailFormState.attendance.beginDate = value !== "" ? value : null), []);
  const beginTimeHandler = useCallback((value: string) => (detailFormState.attendance.beginTime = value), []);
  const endDateHandler = useCallback((value: string) => (detailFormState.attendance.endDate = value !== "" ? value : null), []);
  const endTimeHandler = useCallback((value: string) => (detailFormState.attendance.endTime = value), []);
  const shiftHandler = useCallback((value: string) => (detailFormState.attendance.shift = value), []);
  const reasonHandler = useCallback((value: string) => (detailFormState.attendance.reason = value), []);
  const approverHandler = useCallback((value: Employee) => (detailFormState.attendance.approver = value), []);
  const approvalCommentHandler = useCallback((value: string) => (detailFormState.attendance.approvalComment = value), []);

  useEffect(() => {
    Object.assign(detailFormState.attendance, value);
    ready.current = true;
    return () => {
      Object.assign(detailFormState.attendance, emptyAttendance);
      ready.current = false;
    };
  }, [value]);

  const colSize = featureSpec.isSelfApply ? 6 : 4;

  if (!ready.current) return <Loading />;
  return (
    <Card elevation={6} sx={{ p: 2 }}>
      <Grid container spacing={2}>
        {!featureSpec.isSelfApply ? (
          <Grid sm={4} xs={12}>
            <MemberSelector necessary onChange={memberHandler} readonly={!attendanceSpec.editable} value={attendance.applicants} />
          </Grid>
        ) : null}
        <Grid sm={colSize} xs={12}>
          <StatusSelector onChange={statusHandler} readonly value={attendance.status} />
          <KindSubfamilySelector
            onChangeKind={kindHandler}
            onChangeSubfamily={subfamilyHandler}
            readonly={!attendanceSpec.editable}
            valueKind={attendance.attendanceKindId}
            valueSubfamily={attendance.subfamily}
          />
          <ExecutionSelector onChange={executionHandler} readonly={!attendanceSpec.editable} value={attendance.execution} />
          <BeginDate
            errorMessage={dateErrorMessage}
            necessary={kind.beginDate}
            onChange={beginDateHandler}
            range={dateRange}
            readonly={!attendanceSpec.editable}
            value={attendance.beginDate ?? ""}
          />
          <BeginTime
            errorMessage={timeErrorMessage}
            necessary={kind.beginTime}
            onChange={beginTimeHandler}
            range={timeRange}
            readonly={!attendanceSpec.editable}
            value={attendance.beginTime}
          />
          <EndDate necessary={kind.endDate} onChange={endDateHandler} readonly={!attendanceSpec.editable} value={attendance.endDate ?? ""} />
          <EndTime necessary={kind.endTime} onChange={endTimeHandler} readonly={!attendanceSpec.editable} value={attendance.endTime} />
          <ShiftSelector necessary={kind.shift} onChange={shiftHandler} readonly={!attendanceSpec.editable} value={attendance.shift} />
          <Reason necessary={kind.reason} onChange={reasonHandler} readonly={!attendanceSpec.editable} value={attendance.reason} />
        </Grid>
        <Grid sm={colSize} xs={12}>
          <Agent value={attendance.agent} />
          <ApplicationDate value={attendance.applicationDate ?? ""} />
          <ApprovalDate value={attendance.approvalDate ?? ""} />
          <ApproverSelector necessary onChange={approverHandler} readonly={!attendanceSpec.editable} value={attendance.approver} />
          {attendanceSpec.approvable || attendanceSpec.approved ? (
            <ApprovalComment onChange={approvalCommentHandler} readonly={!attendanceSpec.approvable} value={attendance.approvalComment} />
          ) : null}
        </Grid>
        <Grid xs={12}>{createActionElement(mutableClone(attendance), valid)}</Grid>
      </Grid>
    </Card>
  );
}
export default memo(DetailForm);
