"use client";

import { TextFieldProps, TextField } from "@mui/material";
import { useAtomValue } from "jotai";
import { memo } from "react";

import { NecessaryValue } from "@/app.config";
import { labelsAtom } from "@/composables/label";
import useNecessary from "@/composables/necessary";

/** 申請日付テキストボックスのプロパティ型 */
type ApplicationDateProps = Omit<TextFieldProps, "label" | "readonly" | "value"> & {
  necessary?: boolean | NecessaryValue;
  value: string | null;
};

/**   申請日付テキストボックス（表示専用） */
function ApplicationDate({ necessary, value, ...restProps }: ApplicationDateProps) {
  const labels = useAtomValue(labelsAtom);
  const [show] = useNecessary(necessary);

  if (!show || !value) return null;
  return (
    <TextField fullWidth helperText={" "} inputProps={{ readOnly: true }} label={labels.long.applicationDate} value={value} variant="standard" {...restProps} />
  );
}
export default memo(ApplicationDate);
