"use client";

import { Button, MenuItem, Paper, SxProps, Theme } from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2";
import { useAtomValue } from "jotai";
import { useCallback, useEffect, useMemo } from "react";
import { useSnapshot } from "valtio";

import Config from "@/app.config";
import DateField from "@/components/parts/date-field";
import Select from "@/components/parts/select";
import { attendanceKindsAtom } from "@/composables/attendance-kind";
import { categoryMapAtom } from "@/composables/category";
import { currentCriteriaState, clear as clearCriteria, load as loadCriteria, save as saveCriteria } from "@/composables/criteria";
import { featureState } from "@/composables/feature";
import { labelsAtom } from "@/composables/label";
import { createSelectOption, type Option } from "@/composables/select-option";

/** 検索条件プロパティ型 */
export type CriteriaProps = {
  sx?: SxProps<Theme>;
};

/** 検索条件 */
export default function Criteria({ sx }: CriteriaProps) {
  const labels = useAtomValue(labelsAtom);
  const feature = useSnapshot(featureState);
  const criteria = useSnapshot(currentCriteriaState);
  const categoryMap = useAtomValue(categoryMapAtom);
  const attendanceKinds = useAtomValue(attendanceKindsAtom);

  const statusOptions = useMemo<Option[]>(
    () => createSelectOption(categoryMap.attendanceStatus.members, "name", "code", true),
    [categoryMap.attendanceStatus.members]
  );
  const kindOptions = useMemo<Option[]>(() => createSelectOption(attendanceKinds, "name", "id", true), [attendanceKinds]);

  const searchHandler = useCallback(() => saveCriteria(feature.value), [feature.value]);
  const clearHandler = useCallback(() => clearCriteria(feature.value), [feature.value]);

  useEffect(() => {
    loadCriteria(feature.value);
  }, [feature.value]);

  return (
    <Paper elevation={3} sx={{ padding: "12px", ...sx }}>
      <Grid container spacing={2}>
        <Grid sm={2} xs={6}>
          <Select
            fullWidth
            label={labels.long.status!}
            necessary={Config.necessary.optional}
            onChange={(value) => (currentCriteriaState.status = value)}
            value={criteria.status}
          >
            {statusOptions.map((it) => (
              <MenuItem key={it.value} value={it.value}>
                {it.title ? it.title : <span style={{ minHeight: "1rem" }}></span>}
              </MenuItem>
            ))}
          </Select>
        </Grid>
        <Grid sm={2} xs={6}>
          <Select
            fullWidth
            label={labels.long.attendanceKind!}
            necessary={Config.necessary.optional}
            onChange={(value) => (currentCriteriaState.kind = value)}
            value={criteria.kind}
          >
            {kindOptions.map((it) => (
              <MenuItem key={it.value} value={it.value}>
                {it.title ? it.title : <span style={{ minHeight: "1rem" }}></span>}
              </MenuItem>
            ))}
          </Select>
        </Grid>
        <Grid sm={3} xs={6}>
          <DateField
            label={labels.long.date!}
            necessary={Config.necessary.optional}
            onChange={(value) => (currentCriteriaState.date = value !== "" ? value : null)}
            sx={{ width: "100%" }}
            value={criteria.date ?? ""}
          ></DateField>
        </Grid>
        <Grid sm={3} xs={6}>
          <DateField
            label={labels.long.applicationDate!}
            necessary={Config.necessary.optional}
            onChange={(value) => (currentCriteriaState.applicationDate = value !== "" ? value : null)}
            sx={{ width: "100%" }}
            value={criteria.applicationDate ?? ""}
          ></DateField>
        </Grid>
        <Grid sm={2} xs={12}>
          <Button color="secondary" fullWidth variant="outlined" onClick={searchHandler}>
            {labels.long.search}
          </Button>
          <Button color="secondary" fullWidth variant="outlined" onClick={clearHandler}>
            {labels.long.clear}
          </Button>
        </Grid>
      </Grid>
    </Paper>
  );
}
