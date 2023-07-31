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
import { addFlashMessage, MessageType } from "@/composables/flash-message";
import { labelsAtom } from "@/composables/label";
import { messagesAtom } from "@/composables/message";
import { useRouter } from "@/composables/router";

/** 勤怠情報承認ページ（/attendances/[id]/approve） */
export default function DetailAttendanceX({ params }: { params: { id: number } }) {
  const router = useRouter();
  const labels = useAtomValue(labelsAtom);
  const messages = useAtomValue(messagesAtom);

  const { findById, save } = useAttendance();
  const [attendance, setAttendance] = useState<Attendance | undefined>(undefined);
  const [pending, setPengind] = useState(false);

  const register = useCallback(
    (attendance: Attendance, message: string, messageType: MessageType) => {
      setPengind(true);
      save(attendance).then(
        (data) => {
          setPengind(false);
          addFlashMessage(message, messageType);
          router.replace(`/attendances/${data.id}`);
        },
        (error) => {
          setPengind(false);
          addFlashMessage(error.message, "error");
        }
      );
    },
    [router, save]
  );

  const acceptHandler = useCallback(
    (attendance: Attendance) => () => {
      attendance.status = Config.status.accepted;
      register(attendance, messages.successAttendanceAccept!, "success");
    },
    [messages.successAttendanceAccept, register]
  );

  const rejectHandler = useCallback(
    (attendance: Attendance) => () => {
      attendance.status = Config.status.rejected;
      register(attendance, messages.successAttendanceReject!, "warning");
    },
    [messages.successAttendanceReject, register]
  );

  const backHandler = useCallback(() => router.back(), [router]);

  const createActionElement = useMemo(
    () =>
      createActionFunction(
        { label: labels.long.accept!, onClick: acceptHandler, valid: true },
        { label: labels.long.reject!, onClick: rejectHandler, valid: true },
        { label: labels.long.back!, onClick: backHandler },
        pending
      ),
    [acceptHandler, backHandler, labels.long.accept, labels.long.back, labels.long.reject, pending, rejectHandler]
  );

  useEffect(() => {
    findById(params.id, "edit").then(
      (data) => {
        setAttendance(data);
      },
      (error) => {
        addFlashMessage(error.message, "error");
        router.replace("/");
      }
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.id]);

  return (
    <>
      <Subtitle>{labels.long.approve}</Subtitle>
      {attendance ? <DetailForm createActionElement={createActionElement} value={attendance} /> : <Loading />}
    </>
  );
}
