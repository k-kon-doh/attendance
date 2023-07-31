import { atom } from "jotai";

import { emptyMessages } from "@/api/message";

/** メッセージアトム */
export const messagesAtom = atom(emptyMessages);
