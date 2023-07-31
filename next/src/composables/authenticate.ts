import { useAtomValue } from "jotai";
import { useCallback } from "react";
import { proxy } from "valtio";
import { derive } from "valtio/utils";

import { LoginEmployee, login as loginOfApi, logout as logoutOfApi, logoutEmployee } from "@/api/authenticate";
import { csrfTokenState } from "@/composables/csrf-token";
import { languageAtom } from "@/composables/language";
import { DeepReadonly } from "@/composables/type-utils";

/** カレント社員型 */
export type CurrentEmployeeState = {
  choiceId: string;
  name: string;
  organizationName: string;
  features: string[];
  isLogin: boolean;
};

/** 読み取り専用カレント社員型 */
export type ReadonlyCurrentEmployeeState = DeepReadonly<CurrentEmployeeState>;

/** カレント社員ベースステート */
const currentEmployeeBaseState = proxy<LoginEmployee>(logoutEmployee);

/** カレント社員ステート */
export const currentEmployeeState: CurrentEmployeeState = derive({
  choiceId: (get) => get(currentEmployeeBaseState).choiceId,
  name: (get) => get(currentEmployeeBaseState).name,
  organizationName: (get) => get(currentEmployeeBaseState).organizationName,
  features: (get) => get(currentEmployeeBaseState).features,
  isLogin: (get) => !!get(currentEmployeeBaseState).choiceId,
});

/** 認証 */
export default function useAuthenticate() {
  const language = useAtomValue(languageAtom);

  const login = useCallback(
    async (id: string, password: string) =>
      await loginOfApi(id, password, language).then<LoginEmployee>(
        (it) => {
          Object.assign(currentEmployeeBaseState, it.data);
          csrfTokenState.value = it.response.headers.get("x-csrf-token") ?? "";
          return it.data;
        },
        (error) => {
          Object.assign(currentEmployeeBaseState, logoutEmployee);
          csrfTokenState.value = "";
          throw error;
        }
      ),
    [language]
  );

  const logout = useCallback(async () => {
    logoutOfApi().then(() => {
      Object.assign(currentEmployeeBaseState, logoutEmployee);
      csrfTokenState.value = "";
    });
  }, []);

  return {
    login,
    logout,
  };
}
