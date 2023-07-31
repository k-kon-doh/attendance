"use client";

import { useAtomValue } from "jotai";
import { memo, useMemo } from "react";

import DateField, { DateFieldProps } from "@/components/parts/date-field";
import { labelsAtom } from "@/composables/label";

/** 開始日付テキストボックスのプロパティ型 */
export type BeginDateProps = Omit<DateFieldProps, "label"> & {
  range?: boolean;
};

/** 開始日付テキストボックス */
function BeginDate({ range, ...restProps }: BeginDateProps) {
  const labels = useAtomValue(labelsAtom);
  const label = useMemo(() => (range === true ? labels.long.beginDate : labels.long.date), [labels.long.beginDate, labels.long.date, range]);

  return <DateField label={label} {...restProps} />;
}
export default memo(BeginDate);
