"use client";

import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import { Box, BoxProps, ClickAwayListener, IconButton, Paper, Popper, TextField, TextFieldProps } from "@mui/material";
import { DateCalendar, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { PickerSelectionState } from "@mui/x-date-pickers/internals";
import { enUS, ja } from "date-fns/locale";
import { useAtomValue } from "jotai";
import { ChangeEventHandler, memo, useCallback, useEffect, useMemo, useRef, useState } from "react";

import Config, { NecessaryValue } from "@/app.config";
import { labelsAtom } from "@/composables/label";
import { languageAtom } from "@/composables/language";
import useNecessary from "@/composables/necessary";

/** 日付フィールドプロパティ型 */
export type DateFieldProps = Omit<TextFieldProps, "onChange" | "sx" | "value"> & {
  errorMessage?: string;
  necessary?: boolean | NecessaryValue;
  onChange?: (value: string) => void;
  readonly?: boolean;
  sx?: BoxProps["sx"];
  textFieldSx?: { sx: TextFieldProps["sx"] };
  value?: string;
};

/** 日付文字列の不正検出する正規表現パターン */
const invalidPattern = new RegExp(String.raw`[^${Config.dateDelimiters}\d\s]`);

/** 日付文字列を年、月、日に分割する正規表現パターン */
const splitPattern = new RegExp(String.raw`[${Config.dateDelimiters}]`);

/** 文字列 or 配列から数値化した年月日配列を取得 */
const extractYMD = (value: string | string[]): [number, number, number] => {
  const aValue = typeof value === "string" ? value : value.length === 1 ? value[0] : null;
  return aValue
    ? [Number(aValue.slice(0, -4)) || 0, Number(aValue.slice(-4, -2)) || 0, Number(aValue.slice(-2)) || 0]
    : [Number(value[2]) || 0, Number(value[1]) || 0, Number(value[0]) || 0];
};

/** 年月日配列の値がゼロの要素を当日[年,月,日]要素で置換 */
const adjustYMD = (ymd: [number, number, number]): [number, number, number] => {
  const today = new Date();
  return [
    ymd[0] === 0 ? today.getFullYear() : ymd[0] + (1000 <= ymd[0] ? 0 : 2000),
    ymd[1] === 0 ? today.getMonth() + 1 : ymd[1],
    ymd[2] === 0 ? today.getDate() : ymd[2],
  ];
};

/** 年月日配列で示される日付が暦日に存在するか確認 */
const validateYMD = (ymd: [number, number, number]) => {
  const date = new Date(ymd[0], ymd[1] - 1, ymd[2], 0, 0, 0, 0);
  return date.getMonth() === ymd[1] - 1 && date.getDate() === ymd[2];
};

/** 年月日配列を日付文字列に変換 */
const toStringYMD = (ymd: [number, number, number], delimiter = "") => {
  return `${ymd[0].toString()}${delimiter}${ymd[1].toString().padStart(2, "0")}${delimiter}${ymd[2].toString().padStart(2, "0")}`;
};

/** 日付テキストボックス */
function DateField({ disabled, errorMessage, necessary, onChange, readonly, sx, textFieldSx, value, ...restProps }: DateFieldProps) {
  const [focus, setFocus] = useState(false);

  const labels = useAtomValue(labelsAtom);
  const [show, required] = useNecessary(necessary);

  const editing = useMemo(() => !readonly && !disabled && show && focus, [readonly, disabled, show, focus]);

  const [showValue, setShowValue] = useState("");
  const [showValid, setShowValid] = useState(true);

  const [editValue, setEditValue] = useState("");
  const editValid = useMemo(() => (!required && !editValue) || (!!editValue && validateYMD(adjustYMD(extractYMD(editValue)))), [required, editValue]);

  const currentValue = useMemo(() => (editing ? editValue : showValue), [editing, editValue, showValue]);
  const currentValid = useMemo(() => (editing ? editValid : showValid), [editing, editValid, showValid]);

  const error = useMemo(() => (!currentValid || !!errorMessage) && !readonly, [currentValid, errorMessage, readonly]);
  const message = useMemo(() => {
    let value = "";
    if (currentValid) {
      value = errorMessage ? `${Config.errorMark}${errorMessage}` : " ";
    } else {
      value = required ? `${Config.errorMark}${labels.long.required} YYYYMMDD` : "YYYYMMDD";
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
      const ymd = adjustYMD(extractYMD(editValue));
      workShowValid = true;
      workShowValue = toStringYMD(ymd, Config.dateDelimiter);
      workEditValue = toStringYMD(ymd);
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
      const elements = normalizedValue.replace(/\s/g, "").split(splitPattern).reverse();
      if (3 < elements.length) {
        return;
      }
      const ymd = adjustYMD(extractYMD(elements));
      if (!validateYMD(ymd)) {
        return;
      }
      workShowValid = true;
      workEditValue = toStringYMD(ymd);
    } finally {
      setShowValid(workShowValid);
      setShowValue(workShowValue);
      setEditValue(workEditValue);
    }
  }, [required, value]);

  // Calendar Date Picker
  const language = useAtomValue(languageAtom);

  // TODO: 英語、日本語以外の言語対応
  const locale = useMemo(() => (language == "en" ? enUS : ja), [language]);

  const anchorEl = useRef<HTMLButtonElement>(null);
  const [openCalendar, setOpenCalendar] = useState(false);

  const calendarValue = useMemo(() => {
    const ymd = adjustYMD(extractYMD(editValue));
    return editValid ? new Date(ymd[0], ymd[1] - 1, ymd[2], 0, 0, 0, 0) : new Date();
  }, [editValid, editValue]);

  const selectHandler = useCallback(
    (value: Date | null, state: PickerSelectionState | undefined) => {
      if (state !== "finish") {
        return;
      }
      if (value) {
        const ymd: [number, number, number] = [value.getFullYear(), value.getMonth() + 1, value.getDate()];
        onChange?.(toStringYMD(ymd, Config.dateDelimiter));
      }
      setOpenCalendar(false);
    },
    [onChange]
  );

  if (!show) return null;
  return (
    <>
      <Box sx={{ display: "flex", flexDirection: "row", ...sx }}>
        <TextField
          disabled={disabled ?? false}
          error={error}
          FormHelperTextProps={{ sx: { paddingLeft: "1em" } }}
          helperText={message}
          InputLabelProps={{ required: false, shrink: true }}
          inputProps={{ maxLength: 8, readOnly: readonly ?? false }}
          onBlur={() => focusHandler(false)}
          onFocus={() => focusHandler(true)}
          onChange={changeHandler}
          required={required}
          sx={{ flexGrow: 1, flexShrink: 1, ...textFieldSx }}
          value={currentValue}
          variant="standard"
          {...restProps}
        ></TextField>
        <IconButton
          disabled={(disabled || readonly) ?? false}
          ref={anchorEl}
          sx={{ flexGrow: 0, flexShrink: 0 }}
          onClick={() => setOpenCalendar(!openCalendar)}
        >
          <CalendarMonthIcon />
        </IconButton>
      </Box>
      <Popper anchorEl={anchorEl.current} open={openCalendar} sx={{ zIndex: (theme) => theme.zIndex.drawer + 3 }}>
        <ClickAwayListener onClickAway={() => setOpenCalendar(false)}>
          <Paper elevation={20}>
            <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={locale}>
              <DateCalendar onChange={selectHandler} value={calendarValue} />
            </LocalizationProvider>
          </Paper>
        </ClickAwayListener>
      </Popper>
    </>
  );
}
export default memo(DateField);
