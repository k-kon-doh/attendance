import { useAtomValue } from "jotai";
import { memo, useMemo } from "react";

import TimeField, { TimeFieldProps } from "@/components/parts/time-field";
import { labelsAtom } from "@/composables/label";

/** 開始時間テキストボックスのプロパティ型 */
export type BeginTimeProps = Omit<TimeFieldProps, "label"> & {
  range?: boolean;
};

/** 開始時間テキストボックス */
function BeginTime({ range, ...restProps }: BeginTimeProps) {
  const labels = useAtomValue(labelsAtom);
  const label = useMemo(() => (range === true ? labels.long.beginTime : labels.long.time), [labels.long.beginTime, labels.long.time, range]);

  return <TimeField label={label} {...restProps} />;
}
export default memo(BeginTime);
