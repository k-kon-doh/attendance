"use client";

import { TextField, TextFieldProps } from "@mui/material";
import { useAtomValue } from "jotai";
import { memo, useMemo } from "react";

import Config, { NecessaryValue } from "@/app.config";
import { labelsAtom } from "@/composables/label";
import useNecessary from "@/composables/necessary";

/**  理由／備考テキストエリアのプロパティ型  */
type ReasonProps = Omit<TextFieldProps, "label" | "multiline" | "onChange" | "value"> & {
  necessary?: boolean | NecessaryValue;
  onChange?: (value: string) => void;
  readonly?: boolean;
  value: string;
};

/**  理由／備考テキストエリア  */
function Reason({ necessary, onChange, readonly, value, ...restProps }: ReasonProps) {
  const labels = useAtomValue(labelsAtom);

  const [show, required] = useNecessary(necessary);
  const error = useMemo(() => required && !value && !readonly, [required, value, readonly]);
  const message = useMemo(() => (error ? `${Config.errorMark}${labels.long.required!}` : " "), [error, labels.long.required]);

  if (!show) return null;
  return (
    <TextField
      error={error}
      FormHelperTextProps={{ sx: { paddingLeft: "1em" } }}
      fullWidth
      helperText={message}
      InputLabelProps={{ required: false, shrink: true }}
      inputProps={{ maxLength: Config.maxCommentLength, readOnly: readonly ?? false }}
      label={labels.long.reason}
      multiline
      onChange={(event) => onChange?.(event.target.value)}
      required={required}
      value={value}
      variant="standard"
      {...restProps}
    />
  );
}
export default memo(Reason);
