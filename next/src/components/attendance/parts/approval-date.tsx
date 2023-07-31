"use client";

import { TextFieldProps, TextField } from "@mui/material";
import { useAtomValue } from "jotai";
import { memo } from "react";

import { NecessaryValue } from "@/app.config";
import { labelsAtom } from "@/composables/label";
import useNecessary from "@/composables/necessary";

/**   承認日付テキストボックスのプロパティ型 */
type ApprovalDateProps = Omit<TextFieldProps, "label" | "readonly" | "value"> & {
  necessary?: boolean | NecessaryValue;
  value: string | null;
};

/**   承認日付テキストボックス（表示専用） */
function ApprovalDate({ necessary, value, ...restProps }: ApprovalDateProps) {
  const labels = useAtomValue(labelsAtom);
  const [show] = useNecessary(necessary);

  if (!show || !value) return null;
  return (
    <TextField fullWidth helperText={" "} inputProps={{ readOnly: true }} label={labels.long.approvalDate} value={value} variant="standard" {...restProps} />
  );
}
export default memo(ApprovalDate);
