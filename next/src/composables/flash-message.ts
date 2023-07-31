import { enqueueSnackbar } from "notistack";

import Config from "@/app.config";

/** フラシュメッセージタイプ型 */
export type MessageType = "success" | "warning" | "error" | "info";

/** フラシュメッセージを追加 */
export const addFlashMessage = (message: string, type: MessageType, timeout = 0) => {
  if (type === "error") console.log(message);
  const adjustedTimeout = timeout || Config.flashTimeout[type];
  enqueueSnackbar(message, { variant: type, autoHideDuration: adjustedTimeout, anchorOrigin: { horizontal: "center", vertical: "bottom" } });
};
