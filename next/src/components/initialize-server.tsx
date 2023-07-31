import { headers } from "next/headers";

import { fetchAttendanceKinds } from "@/api/attendance-kind";
import { fetchCategoryMap } from "@/api/category";
import { fetchLabels } from "@/api/label";
import { fetchMessages } from "@/api/message";
import Config from "@/app.config";
import { Initialize as InitClient } from "@/components/initialize-client";

import type { AttendanceKind, AttendanceKindMap } from "@/api/attendance-kind";
import type { CategoryMap } from "@/api/category";
import type { Labels } from "@/api/label";
import type { Messages } from "@/api/message";

export type IntialValues = {
  language: string;
  labels: Labels;
  messages: Messages;
  categoryMap: CategoryMap;
  attendanceKinds: AttendanceKind[];
  attendanceKindMap: AttendanceKindMap;
};

function getLanguage() {
  try {
    const lang = headers().get("accept-language")?.split(/[,;]/, 1)[0] ?? Config.defaultLanguage;
    return lang;
  } catch (e) {
    // static, SSG, SSR ビルド時、リクエストヘッダーがないので例外が発生する。
    return Config.defaultLanguage;
  }
}

export async function getInitialValues() {
  const language = getLanguage();
  const [labels, messages, categoryMap, attendanceKinds] = await Promise.all([
    fetchLabels(language),
    fetchMessages(language),
    fetchCategoryMap(language),
    fetchAttendanceKinds(language),
  ]);
  return {
    language,
    labels,
    messages,
    categoryMap,
    attendanceKinds: attendanceKinds[0],
    attendanceKindMap: attendanceKinds[1],
  };
}

/** サーバーサイド初期化 */
export async function Initialize({ children }: { children: React.ReactNode }) {
  // サーバーサイドで useHydrateAtoms が処理された後で
  // 残りのサーバーサイド処理を行う必要がある。
  // 並行処理すると クライアントサイドの hydration 処理で差異が発生してエラーになる。
  return (
    <>
      <InitClient values={await getInitialValues()} />
      {children}
    </>
  );
}
