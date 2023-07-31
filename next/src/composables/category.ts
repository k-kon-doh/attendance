import { atom } from "jotai";

import { emptyCategoryMap } from "@/api/category";

/** カテゴリーマップアトム */
export const categoryMapAtom = atom(emptyCategoryMap);
