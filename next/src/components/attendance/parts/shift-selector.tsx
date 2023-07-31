"use client";

import { MenuItem } from "@mui/material";
import { useAtomValue } from "jotai";
import { memo, useMemo } from "react";

import Select, { SelectProps } from "@/components/parts/select";
import { categoryMapAtom } from "@/composables/category";
import { labelsAtom } from "@/composables/label";
import { createSelectOption, Option } from "@/composables/select-option";

/**  勤務形態セレクタのプロパティ型  */
type ShiftProps = Omit<SelectProps, "label">;

/**  勤務形態セレクタ */
function ShiftSelector(props: ShiftProps) {
  const labels = useAtomValue(labelsAtom);
  const categoryMap = useAtomValue(categoryMapAtom);

  const options = useMemo<Option[]>(
    () => [{ title: "", value: "" }, ...createSelectOption(categoryMap.shift.members, "name", "code")],
    [categoryMap.shift.members]
  );

  return (
    <Select fullWidth label={labels.long.shift!} {...props}>
      {options.map((it) => (
        <MenuItem key={it.value} value={it.value}>
          {it.title ? it.title : <span style={{ minHeight: "1rem" }}></span>}
        </MenuItem>
      ))}
    </Select>
  );
}
export default memo(ShiftSelector);
