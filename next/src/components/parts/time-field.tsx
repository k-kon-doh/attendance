"use client";

import { TextField, TextFieldProps } from "@mui/material";
import { useAtomValue } from "jotai";
import { ChangeEventHandler, memo, useCallback, useEffect, useMemo, useState } from "react";

import Config, { NecessaryValue } from "@/app.config";
import { labelsAtom } from "@/composables/label";
import useNecessary from "@/composables/necessary";

/** 時刻フィールドプロパティ型 */
export type TimeFieldProps = Omit<TextFieldProps, "onChange" | "value"> & {
  errorMessage?: string;
  necessary?: boolean | NecessaryValue;
  onChange?: (value: string) => void;
  readonly?: boolean;
  value?: string;
};

/** 入力可能最大時 */
const maxHour = Number(Config.maxTime.hour) || 0;

/** 入力可能最大分 */
const maxMinute = Number(Config.maxTime.minute) || 0;

/** 時刻文字列の不正検出する正規表現パターン */
const invalidPattern = new RegExp(String.raw`[^${Config.timeDelimiter}\d\s]`);

/** 文字列 or 配列から数値化した時分配列を取得 */
const extractHM = (value: string | string[]): [number, number] => {
  const aValue = typeof value === "string" ? value : value.length === 1 ? value[0] : null;
  return aValue ? [Number(aValue.slice(0, -2)) || 0, Number(aValue.slice(-2)) || 0] : [Number(value[1]) || 0, Number(value[0]) || 0];
};

/** 時分配列で示される時刻の検証 */
const validateHM = (hm: [number, number]) => {
  return 0 <= hm[0] && hm[0] <= maxHour && 0 <= hm[1] && hm[1] <= maxMinute;
};

/** 時分配列を時刻文字列に変換 */
const toStringHM = (hm: [number, number], delimiter: string = "") => `${hm[0].toString().padStart(2, "0")}${delimiter}${hm[1].toString().padStart(2, "0")}`;

/** 時刻テキストボックス */
function TimeField({ disabled, errorMessage, necessary, onChange, readonly, value, ...restProps }: TimeFieldProps) {
  const [focus, setFocus] = useState(false);

  const labels = useAtomValue(labelsAtom);
  const [show, required] = useNecessary(necessary);

  const editing = useMemo(() => !readonly && !disabled && show && focus, [readonly, disabled, show, focus]);

  const [showValue, setShowValue] = useState("");
  const [showValid, setShowValid] = useState(true);

  const [editValue, setEditValue] = useState("");
  const editValid = useMemo(() => (!required && !editValue) || (!!editValue && validateHM(extractHM(editValue))), [required, editValue]);

  const currentValue = useMemo(() => (editing ? editValue : showValue), [editing, editValue, showValue]);
  const currentValid = useMemo(() => (editing ? editValid : showValid), [editing, editValid, showValid]);

  const error = useMemo(() => (!currentValid || !!errorMessage) && !readonly, [currentValid, errorMessage, readonly]);
  const message = useMemo(() => {
    let value = "";
    if (currentValid) {
      value = errorMessage ? `${Config.errorMark}${errorMessage}` : " ";
    } else {
      const timeNote = `00${Config.timeDelimiter}00～${Config.maxTime.hour}${Config.timeDelimiter}${Config.maxTime.minute}`;
      value = required ? `${Config.errorMark}${labels.long.required} ${timeNote}` : timeNote;
    }
    return readonly ? " " : value;
  }, [currentValid, errorMessage, labels, readonly, required]);

  const changeHandler: ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement> = useCallback((e) => {
    setEditValue(e.target.value.replace(/\D/g, ""));
  }, []);

  const focusHandler = (focusValue: boolean) => {
    if (readonly || disabled) {
      return;
    }

    setFocus(focusValue);
    if (focusValue) {
      return;
    }

    let workShowValid = !required;
    let workShowValue = "";
    let workEditValue = "";
    if (editValid && editValue) {
      const hm = extractHM(editValue);
      workShowValid = true;
      workShowValue = toStringHM(hm, Config.timeDelimiter);
      workEditValue = toStringHM(hm);
    }
    setShowValid(workShowValid);
    setShowValue(workShowValue);
    setEditValue(workEditValue);

    onChange?.(workShowValue);
  };

  useEffect(() => {
    const normalizedValue = value?.trim() ?? "";
    let workShowValid = false;
    const workShowValue = normalizedValue;
    let workEditValue = "";
    try {
      if (!normalizedValue) {
        workShowValid = !required;
        return;
      }
      if (invalidPattern.test(normalizedValue)) {
        return;
      }
      const elements = normalizedValue.replace(/\s/g, "").split(Config.timeDelimiter).reverse();
      if (2 < elements.length) {
        return;
      }
      const hm = extractHM(elements);
      if (!validateHM(hm)) {
        return;
      }
      workShowValid = true;
      workEditValue = toStringHM(hm);
    } finally {
      setShowValid(workShowValid);
      setShowValue(workShowValue);
      setEditValue(workEditValue);
    }
  }, [required, value]);

  if (!show) return null;
  return (
    <TextField
      disabled={disabled ?? false}
      error={error}
      FormHelperTextProps={{ sx: { paddingLeft: "1em" } }}
      fullWidth
      helperText={message}
      InputLabelProps={{ required: false, shrink: true }}
      inputProps={{ maxLength: 4, readOnly: readonly ?? false }}
      onBlur={() => focusHandler(false)}
      onFocus={() => focusHandler(true)}
      onChange={changeHandler}
      required={required}
      value={currentValue}
      variant="standard"
      {...restProps}
    ></TextField>
  );
}
export default memo(TimeField);
