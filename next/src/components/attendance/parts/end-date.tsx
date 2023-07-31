"use client";

import { useAtomValue } from "jotai";
import { memo } from "react";

import DateField, { DateFieldProps } from "@/components/parts/date-field";
import { labelsAtom } from "@/composables/label";

export type EndDateProps = Omit<DateFieldProps, "label">;

/** 終了日付テキストボックス */
function EndDate(props: EndDateProps) {
  const labels = useAtomValue(labelsAtom);

  return <DateField label={labels.long.endDate} {...props} />;
}
export default memo(EndDate);
