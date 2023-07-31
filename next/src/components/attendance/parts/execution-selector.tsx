"use client";

import { MenuItem } from "@mui/material";
import { useAtomValue } from "jotai";
import { memo, useMemo } from "react";

import Select, { SelectProps } from "@/components/parts/select";
import { categoryMapAtom } from "@/composables/category";
import { labelsAtom } from "@/composables/label";
import { createSelectOption, type Option } from "@/composables/select-option";

/**  実施状態セレクタのプロパティ型 */
type ExecutionProps = Omit<SelectProps, "label">;

/**  実施状態セレクタ */
function ExecutionSelector(props: ExecutionProps) {
  const labels = useAtomValue(labelsAtom);
  const categoryMap = useAtomValue(categoryMapAtom);

  const options = useMemo<Option[]>(
    () => createSelectOption(categoryMap.attendanceExecution.members, "name", "code"),
    [categoryMap.attendanceExecution.members]
  );

  return (
    <Select fullWidth label={labels.long.execution!} {...props}>
      {options.map((it) => (
        <MenuItem key={it.value} value={it.value}>
          {it.title ? it.title : <span style={{ minHeight: "1rem" }}></span>}
        </MenuItem>
      ))}
    </Select>
  );
}
export default memo(ExecutionSelector);
