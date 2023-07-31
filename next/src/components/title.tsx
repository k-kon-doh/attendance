"use client";

import { useAtomValue } from "jotai";

import { labelsAtom } from "@/composables/label";

/** アプリケーションタイトル表示 */
export default function Title() {
  const labels = useAtomValue(labelsAtom);
  return <span>{labels.long.title}</span>;
}
