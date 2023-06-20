import type { FetchError } from "ofetch";

/** ステート識別子 */
const stateKey = "current-employee";

/** ログイン従業員型 */
type Employee = {
  choiceId: string;
  name: string;
  organizationName: string;
  features: string[];
};

/** ログイン */
const login = (...args: [] | [string, string]) => {
  const config = useAppConfig();
  const { setToken, clearToken } = useCsrfToken();
  const { acceptLanguageHeader } = useAcceptLanguage();

  const immediate = 0 < args.length;
  const [id, password] = args;
  const result = useAsyncData<Employee, FetchError<any>>(
    "authenticate",
    () =>
      $fetch(`/session`, {
        baseURL: config.apiURL,
        method: "post",
        credentials: "include",
        headers: acceptLanguageHeader.value,
        body: {
          login_id: id,
          password,
        },
        onResponse({ response }) {
          setToken(response.headers.get("x-csrf-token") ?? "");
        },
        onRequestError() {
          clearToken();
        },
        onResponseError() {
          clearToken();
        },
      }),
    {
      immediate,
    }
  );
  result.pending.value = immediate;
  if (immediate) {
    result.then((value) => {
      const currentEmployee = useState<Employee | null>(stateKey);
      currentEmployee.value = value.data.value && !value.error.value ? value.data.value : null;
    });
  }
  return result;
};

/** ログアウト */
const logout = () => {
  const currentEmployee = useState<Employee | null>(stateKey);
  currentEmployee.value = null;
  const { clearToken } = useCsrfToken();
  clearToken();
  // TODO: サーバーAPIを叩いてセッション情報とセッションIDクッキーを消す。
};

/** 認証 */
export const useAuthenticate = () => {
  const currentEmployee = useState<Employee | null>(stateKey, () => null);
  const { register } = useCleaner();
  register(stateKey, logout);
  return {
    currentEmployee: readonly(currentEmployee),
    login,
    logout,
  };
};
