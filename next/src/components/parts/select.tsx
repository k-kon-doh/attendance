"use client";

import { TextField, TextFieldProps } from "@mui/material";
import { useAtomValue } from "jotai";
import { ChangeEventHandler, memo, useCallback, useMemo } from "react";

import Config, { NecessaryValue } from "@/app.config";
import { labelsAtom } from "@/composables/label";
import useNecessary from "@/composables/necessary";

export type SelectProps = Omit<TextFieldProps, "onChange"> & {
  necessary?: boolean | NecessaryValue;
  onChange?: (value: string) => void;
  readonly?: boolean;
};

/** コンボボックス */
function Select({ necessary, onChange, readonly, value, ...restProps }: SelectProps) {
  const labels = useAtomValue(labelsAtom);

  const [show, required] = useNecessary(necessary);
  const error = useMemo(() => !!required && !value && !readonly, [readonly, required, value]);
  const message = useMemo(() => (error ? `${Config.errorMark}${labels.long.required!}` : " "), [error, labels.long.required]);

  const changeHandler: ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement> = useCallback(
    (e) => {
      onChange?.(e.target.value);
    },
    [onChange]
  );

  if (!show) return null;
  return (
    <TextField
      error={error}
      FormHelperTextProps={{ sx: { paddingLeft: "1em" } }}
      helperText={message}
      InputLabelProps={{ required: false, shrink: true }}
      InputProps={{ readOnly: readonly ?? false }}
      required={required}
      onChange={changeHandler}
      select
      value={value}
      variant="standard"
      {...restProps}
    ></TextField>
  );
}
export default memo(Select);
