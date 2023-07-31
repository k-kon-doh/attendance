"use client";

import { MenuItem } from "@mui/material";
import { useAtomValue } from "jotai";
import { memo, useCallback, useEffect, useMemo } from "react";

import Config from "@/app.config";
import Select, { SelectProps } from "@/components/parts/select";
import { attendanceKindMapAtom, attendanceKindsAtom } from "@/composables/attendance-kind";
import { categoryMapAtom } from "@/composables/category";
import { labelsAtom } from "@/composables/label";
import { createSelectOption, type Option } from "@/composables/select-option";

/**  勤務内容・種別セレクタのプロパティ型 */
type KindSubfamilyProps = Omit<SelectProps, "label" | "onChange" | "value"> & {
  onChangeKind?: (value: number) => void;
  onChangeSubfamily?: (value: string) => void;
  valueKind: number;
  valueSubfamily: string;
};

/**  勤務内容・種別セレクタ */
function KindSubfamilySelector({ onChangeKind, onChangeSubfamily, valueKind, valueSubfamily, ...restProps }: KindSubfamilyProps) {
  const labels = useAtomValue(labelsAtom);
  const categoryMap = useAtomValue(categoryMapAtom);
  const attendanceKinds = useAtomValue(attendanceKindsAtom);
  const attendanceKindMap = useAtomValue(attendanceKindMapAtom);

  const kindOptions = useMemo<Option[]>(() => createSelectOption(attendanceKinds, "name", "id"), [attendanceKinds]);
  const attendanceKind = useMemo(() => attendanceKindMap[valueKind]!, [attendanceKindMap, valueKind]);
  const subfamilies = useMemo(
    () => Config.subfamilyMap[attendanceKind.family].map((it) => categoryMap.attendanceSubfamily.codeMap[it]!),
    [attendanceKind.family, categoryMap.attendanceSubfamily.codeMap]
  );
  const subfamilyOptions = useMemo<Option[]>(() => createSelectOption(subfamilies, "name", "code"), [subfamilies]);

  const kindValue = useMemo(() => valueKind?.toString() ?? "", [valueKind]);
  const subfamilyValue = useMemo(() => valueSubfamily, [valueSubfamily]);

  const changeKindhandler = useCallback((value: string) => onChangeKind?.(Number(value)), [onChangeKind]);
  const changeSubfamilyhandler = useCallback((value: string) => onChangeSubfamily?.(value), [onChangeSubfamily]);

  useEffect(() => {
    if (attendanceKind.family === Config.family.solo) {
      onChangeSubfamily?.(Config.subfamily.solo);
    } else if (valueSubfamily === Config.subfamily.solo) {
      onChangeSubfamily?.(Config.subfamily.plan);
    }
  }, [attendanceKind, onChangeSubfamily, valueSubfamily]);

  return (
    <>
      <Select fullWidth label={labels.long.attendanceKind!} onChange={changeKindhandler} value={kindValue} {...restProps}>
        {kindOptions.map((it) => (
          <MenuItem key={it.value} value={it.value}>
            {it.title ? it.title : <span style={{ minHeight: "1rem" }}></span>}
          </MenuItem>
        ))}
      </Select>
      <Select fullWidth label={labels.long.subfamily!} onChange={changeSubfamilyhandler} value={subfamilyValue} {...restProps}>
        {subfamilyOptions.map((it) => (
          <MenuItem key={it.value} value={it.value}>
            {it.title ? it.title : <span style={{ minHeight: "1rem" }}></span>}
          </MenuItem>
        ))}
      </Select>
    </>
  );
}
export default memo(KindSubfamilySelector);
