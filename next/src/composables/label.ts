import { atom } from "jotai";

import { emptyLabels } from "@/api/label";

/** ラベルアトム */
export const labelsAtom = atom(emptyLabels);
