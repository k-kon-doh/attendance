import { useMemo } from "react";

import Config, { NecessaryValue } from "@/app.config";

/** necessary を show と required に分解 */
export default function useNecessary(necessary: boolean | NecessaryValue | undefined) {
  return useMemo<[boolean, boolean]>(() => {
    if (typeof necessary === "string") {
      return [Config.necessary.notNeeded !== necessary, Config.necessary.required === necessary];
    }
    if (typeof necessary === "boolean") {
      return [true, necessary];
    }
    return [true, false];
  }, [necessary]);
}
