"use client";

import { TextField, TextFieldProps } from "@mui/material";
import { useAtomValue } from "jotai";
import { memo } from "react";

import { NecessaryValue } from "@/app.config";
import { labelsAtom } from "@/composables/label";
import useNecessary from "@/composables/necessary";

import type { Employee } from "@/api/attendance";

/** 代理申請者テキストボックスのプロパティ型 */
type AgentProps = Omit<TextFieldProps, "label" | "readonly" | "value"> & {
  necessary?: boolean | NecessaryValue;
  value: Employee | null | undefined;
};

/**  代理申請者テキストボックス（表示専用） */
function Agent({ necessary, value, ...restProps }: AgentProps) {
  const labels = useAtomValue(labelsAtom);
  const [show] = useNecessary(necessary);

  if (!show || !value || !value.choiceId) return null;
  return (
    <TextField fullWidth helperText={" "} inputProps={{ readOnly: true }} label={labels.long.agent} value={value.name} variant="standard" {...restProps} />
  );
}
export default memo(Agent);
