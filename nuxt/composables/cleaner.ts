/** ステート識別子 */
const stateKKey = "cleaner";

/** 掃除対象型 */
type CleanTarget = {
  id: string;
  func: () => void;
};

/** 掃除対象を登録 */
const register = (id: string, func: () => void) => {
  // 掃除を必要とするのは、クライアントのみ。かつ、関数は toJSON できない。
  if (process.server) {
    return;
  }
  const targets = useState<CleanTarget[]>(stateKKey, () => []);
  if (!targets.value.find((it) => it.id === id)) {
    targets.value.push({ id, func });
  }
};

/** 掃除 */
const clean = () => {
  const targets = useState<CleanTarget[]>(stateKKey, () => []);
  targets.value.forEach((it) => {
    it.func();
  });
};

/** 掃除機 */
export const useCleaner = () => {
  return {
    register,
    clean,
  };
};
