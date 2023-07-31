"use client";

import { useAtomValue } from "jotai";
import { useCallback, useEffect, useMemo, useState } from "react";

import { Attendance } from "@/api/attendance";
import Loading from "@/app/loading";
import Config from "@/app.config";
import DetailForm from "@/components/attendance/parts/detail-form";
import { createActionFunction } from "@/components/attendance/parts/detail-form-action";
import { Subtitle } from "@/components/attendance/subtitle";
import { useAttendance } from "@/composables/attendance";
import { addFlashMessage } from "@/composables/flash-message";
import { labelsAtom } from "@/composables/label";
import { messagesAtom } from "@/composables/message";
import { useRouter } from "@/composables/router";

/** 勤怠情報編集ページ（/attendances/[id]/edit） */
export default function EditAttendanceX({ params }: { params: { id: number } }) {
  const router = useRouter();
  const labels = useAtomValue(labelsAtom);
  const messages = useAtomValue(messagesAtom);

  const { findById, save } = useAttendance();
  const [attendance, setAttendance] = useState<Attendance | undefined>(undefined);
  const [pending, setPengind] = useState(false);

  const register = useCallback(
    (attendance: Attendance, message: string) => {
      setPengind(true);
      save(attendance).then(
        (data) => {
          setPengind(false);
          addFlashMessage(message, "success");
          if (data.status === Config.status.making) {
            setAttendance(data);
          } else {
            router.replace(`/attendances/${data.id}`);
          }
        },
        (error) => {
          setPengind(false);
          addFlashMessage(error.message, "error");
        }
      );
    },
    [router, save]
  );

  const applyHandler = useCallback(
    (attendance: Attendance) => () => {
      attendance.status = Config.status.applying;
      register(attendance, messages.successAttendanceApply!);
    },
    [messages.successAttendanceApply, register]
  );

  const saveHandler = useCallback(
    (attendance: Attendance) => () => {
      attendance.status = Config.status.making;
      register(attendance, messages.successAttendanceRegister!);
    },
    [messages.successAttendanceRegister, register]
  );

  const backHandler = useCallback(() => router.back(), [router]);

  const createActionElement = useMemo(
    () =>
      createActionFunction(
        { label: labels.long.apply!, onClick: applyHandler, valid: true },
        { label: labels.long.save!, onClick: saveHandler, valid: false },
        { label: labels.long.back!, onClick: backHandler },
        pending
      ),
    [applyHandler, backHandler, labels.long.apply, labels.long.back, labels.long.save, pending, saveHandler]
  );

  useEffect(() => {
    findById(params.id, "edit").then(
      (data) => setAttendance(data),
      (error) => {
        addFlashMessage(error.message, "error");
        router.replace("/");
      }
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.id]);

  return (
    <>
      <Subtitle>{labels.long.edit}</Subtitle>
      {attendance ? <DetailForm createActionElement={createActionElement} value={attendance} /> : <Loading />}
    </>
  );
}
