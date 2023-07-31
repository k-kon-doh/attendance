"use client";

import { useAtomValue } from "jotai";
import { useCallback, useEffect, useMemo, useState } from "react";

import { Attendance } from "@/api/attendance";
import Loading from "@/app/loading";
import DetailForm from "@/components/attendance/parts/detail-form";
import { createBackActionFunction } from "@/components/attendance/parts/detail-form-action";
import { Subtitle } from "@/components/attendance/subtitle";
import { useAttendance } from "@/composables/attendance";
import { addFlashMessage } from "@/composables/flash-message";
import { labelsAtom } from "@/composables/label";
import { useRouter } from "@/composables/router";

/** 勤怠情報照会ページ（/attendances/[id]） */
export default function ShowAttendance({ params }: { params: { id: number } }) {
  const router = useRouter();
  const labels = useAtomValue(labelsAtom);

  const { findById } = useAttendance();
  const [attendance, setAttendance] = useState<Attendance | undefined>(undefined);

  const backHandler = useCallback(() => router.back(), [router]);

  const createActionElement = useMemo(
    () => createBackActionFunction({ label: labels.long.back!, onClick: backHandler }, false),
    [backHandler, labels.long.back]
  );

  useEffect(() => {
    findById(params.id, "show").then(
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
      <Subtitle>{labels.long.show}</Subtitle>
      {attendance ? <DetailForm createActionElement={createActionElement} value={attendance} /> : <Loading />}
    </>
  );
}
