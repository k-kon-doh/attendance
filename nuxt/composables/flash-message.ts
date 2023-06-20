import type { Ref } from "vue";
import type { FetchError } from "ofetch";

/** ステートID識別子 */
const stateIdKey = "flash-message-id";

/** ステート識別子 */
const stateKey = "flash-message";

/** メッセージタイプ型 */
type MessageType = "success" | "warning" | "error" | "info";

/** メッセージ型 */
export type Message = {
  id: number;
  type: MessageType;
  contents: string[];
  timeout: number;
};

/** メッセージを追加 */
const addFlashMessage = (message: string, type: MessageType, timeout = 0) => {
  const config = useAppConfig();
  const id = useState<number>(stateIdKey);
  const messages = useState<Message[]>(stateKey);
  const adjustedTimeout = timeout || config.flashTimeout[type];
  id.value += 1;
  messages.value.unshift({ id: id.value, type, contents: message.split(/\r\n|\r|\n|\\n/), timeout: adjustedTimeout });
};

/** メッセージキーのメッセージを追加 */
const addFlashMessageKey = (messageKey: string, type: MessageType, timeout = 0) => {
  const { messages } = useMessage();
  addFlashMessage(messages.value[messageKey]!, type, timeout);
};

/** メッセージを削除 */
const removeFlashMessage = (id: number) => {
  const messages = useState<Message[]>(stateKey);
  const index = messages.value.findIndex((it) => it.id === id);
  if (index !== -1) {
    messages.value.splice(index, 1);
  }
};

/** エラーメッセージを追加 */
export const addFlashMessageIfError = (error: FetchError<any> | Ref<FetchError<any> | null> | null, type: MessageType = "error", timeout = 0) => {
  const fetchError = unref(error);
  if (fetchError == null) {
    return;
  }
  const message = fetchError.data?.message || fetchError.message || "UNKNOWN ERROR";
  addFlashMessage(message, type, timeout);
};

/** フラッシュ・メッセージ */
export const useFlashMessage = () => {
  useState<number>(stateIdKey, () => 0);
  const messages = useState<Message[]>(stateKey, () => []);
  return {
    messages: readonly(messages),
    addFlashMessage,
    addFlashMessageKey,
    removeFlashMessage,
  };
};
