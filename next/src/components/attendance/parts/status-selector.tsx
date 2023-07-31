"use client";

import { MenuItem } from "@mui/material";
import { useAtomValue } from "jotai";
import { memo, useMemo } from "react";

import Select, { SelectProps } from "@/components/parts/select";
import { categoryMapAtom } from "@/composables/category";
import { labelsAtom } from "@/composables/label";
import { createSelectOption, type Option } from "@/composables/select-option";

/** 申請状態セレクタのプロパティ型 */
type StatusSelectorProps = Omit<SelectProps, "value"> & {
  value: string;
};

/**  申請状態セレクタ */
function StatusSelector({ value, ...restProps }: StatusSelectorProps) {
  const labels = useAtomValue(labelsAtom);
  const categoryMap = useAtomValue(categoryMapAtom);

  const options = useMemo<Option[]>(() => createSelectOption(categoryMap.attendanceStatus.members, "name", "code"), [categoryMap.attendanceStatus.members]);

  return (
    <Select fullWidth label={labels.long.status!} value={value} {...restProps}>
      {options.map((it) => (
        <MenuItem key={it.value} value={it.value}>
          {it.title ? it.title : <span style={{ minHeight: "1rem" }}></span>}
        </MenuItem>
      ))}
    </Select>
  );
}
export default memo(StatusSelector);
