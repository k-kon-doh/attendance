"use client";

import { Tabs, Tab, TabsProps } from "@mui/material";
import { useAtomValue } from "jotai";
import { useMemo } from "react";
import { useSnapshot } from "valtio";

import { currentEmployeeState as currentEmployeeState } from "@/composables/authenticate";
import { categoryMapAtom } from "@/composables/category";
import { featureState } from "@/composables/feature";

import type { FeatureValue } from "@/app.config";

/** 機能切替タブプロパティ型 */
export type FeatureTabProps = Omit<TabsProps, "onChange" | "value" | "variant">;

/** 機能切替タブ */
export default function FeatureTab(props: FeatureTabProps) {
  // 状態管理： valtio
  const feature = useSnapshot(featureState);
  const currentEmployee = useSnapshot(currentEmployeeState);

  // 状態管理： jotai
  const categoryMap = useAtomValue(categoryMapAtom);

  const tabs = useMemo(
    () => categoryMap.feature.members.filter((it) => currentEmployee.features.includes(it.code)),
    [categoryMap.feature.members, currentEmployee.features]
  );

  const changeHandler = (_: React.SyntheticEvent, value: FeatureValue): void => {
    featureState.value = value;
  };

  return (
    <Tabs onChange={changeHandler} value={feature.value} variant="fullWidth" {...props}>
      {tabs.map((tab) => (
        <Tab key={tab.code} label={tab.name} value={tab.code} />
      ))}
    </Tabs>
  );
}
