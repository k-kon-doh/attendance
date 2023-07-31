"use client";

import { useAtom, useSetAtom } from "jotai";
import { useHydrateAtoms } from "jotai/utils";
import { useEffect } from "react";

import { fetchAttendanceKinds } from "@/api/attendance-kind";
import { fetchCategoryMap } from "@/api/category";
import { fetchLabels } from "@/api/label";
import { fetchMessages } from "@/api/message";
import Config from "@/app.config";
import { attendanceKindMapAtom, attendanceKindsAtom } from "@/composables/attendance-kind";
import { categoryMapAtom } from "@/composables/category";
import { labelsAtom } from "@/composables/label";
import { languageAtom } from "@/composables/language";
import { messagesAtom } from "@/composables/message";

import type { IntialValues } from "@/components/initialize-server";

type Props = {
  values: IntialValues;
};

/** クライアントサイド初期化 */
export function Initialize(props: Props) {
  useHydrateAtoms([
    [languageAtom, props.values.language],
    [labelsAtom, props.values.labels],
    [categoryMapAtom, props.values.categoryMap],
    [attendanceKindsAtom, props.values.attendanceKinds],
    [attendanceKindMapAtom, props.values.attendanceKindMap],
  ]);
  const [language, setLanguage] = useAtom(languageAtom);
  const setLabels = useSetAtom(labelsAtom);
  const setMessages = useSetAtom(messagesAtom);
  const setCategoryMapAtom = useSetAtom(categoryMapAtom);
  const setAttendanceKinds = useSetAtom(attendanceKindsAtom);
  const setAttendanceKindMap = useSetAtom(attendanceKindMapAtom);

  useEffect(() => {
    const timerId = setInterval(() => {
      setLanguage(navigator.language || Config.defaultLanguage);
    }, Config.intervalLanguage);
    return () => clearInterval(timerId);
  }, [setLanguage]);

  useEffect(() => {
    fetchLabels(language).then((it) => setLabels(it));
    fetchMessages(language).then((it) => setMessages(it));
    fetchCategoryMap(language).then((it) => setCategoryMapAtom(it));
    fetchAttendanceKinds(language).then((it) => {
      setAttendanceKinds(it[0]);
      setAttendanceKindMap(it[1]);
    });
  }, [language, setAttendanceKindMap, setAttendanceKinds, setCategoryMapAtom, setLabels, setMessages]);

  return null;
}
