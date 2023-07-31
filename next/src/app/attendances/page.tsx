"use client";

import { Box, Stack } from "@mui/material";
import { useCallback, useMemo } from "react";
import { useSnapshot } from "valtio";

import Config from "@/app.config";
import Criteria from "@/components/attendances/criteria";
import FeatureTab from "@/components/attendances/feature-tab";
import List from "@/components/attendances/list";
import NewFab from "@/components/attendances/new-fab";
import { useAttendances } from "@/composables/attendance";
import { analyze, featureState } from "@/composables/feature";
import { addFlashMessage } from "@/composables/flash-message";
import { useRouter } from "@/composables/router";

/** 勤怠情報一覧ページ（/attendances） */
export default function AttendanceList() {
  const router = useRouter();
  const feature = useSnapshot(featureState);
  const featureSpec = useMemo(() => analyze(feature), [feature]);

  const { data: attendances, error } = useAttendances();
  if (error) {
    addFlashMessage(error.message, "error");
    router.replace("/");
  }

  const doubleClickHandler = useCallback(
    (id: number) => {
      if (!attendances || attendances.length == 0) return;

      const attendance = attendances.find((it) => it.id === id);
      if (!attendance) return;

      let action = "";
      switch (feature.value) {
        case Config.features.selfApply:
          if (attendance.status === Config.status.making && !attendance.agent.choiceId) {
            action = "/edit";
          }
          break;
        case Config.features.representativeApply:
          if (attendance.status === Config.status.making) {
            action = "/edit";
          }
          break;
        case Config.features.approve:
          if (attendance.status === Config.status.applying) {
            action = "/approve";
          }
          break;
      }
      router.push(`/attendances/${attendance.id}${action}`);
    },
    [attendances, feature.value, router]
  );

  const newHandler = useCallback(() => router.push("/attendances/new"), [router]);

  return (
    <>
      <Stack spacing={2} sx={{ direction: "column", height: "100%", width: "100%" }}>
        <FeatureTab sx={{ flexGrow: 0, flexShrink: 0 }} />
        {featureSpec.isMasterMaintain ? (
          <Box sx={{ flexGrow: 1, flexShrink: 1 }}>※ 割愛</Box>
        ) : (
          <>
            <Criteria sx={{ flexGrow: 0, flexShrink: 0 }} />
            <List sx={{ flexGrow: 1, flexShrink: 1 }} onDoubleClick={doubleClickHandler} value={attendances} />
          </>
        )}
      </Stack>
      {featureSpec.isApply ? <NewFab onClick={newHandler} /> : null}
    </>
  );
}
