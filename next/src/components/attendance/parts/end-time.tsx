"use client";

import { useAtomValue } from "jotai";
import { memo } from "react";

import TimeField, { TimeFieldProps } from "@/components/parts/time-field";
import { labelsAtom } from "@/composables/label";

/** 終了時間テキストボックスのプロパティ型 */
export type EndTimeProps = Omit<TimeFieldProps, "label">;

/** 終了時間テキストボックス */
function EndTime(props: EndTimeProps) {
  const labels = useAtomValue(labelsAtom);

  return <TimeField label={labels.long.endTime} {...props} />;
}
export default memo(EndTime);
