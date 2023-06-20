/** ステート識別子 */
const stateKey = "csrf-token";

/** トークンをセット */
const setToken = (token: string) => {
  useState<string | null>(stateKey).value = token;
};

/** トークンをクリア */
const clearToken = () => {
  useState<string | null>(stateKey).value = null;
};

/** クロスサイトリクエストフォージェリ対策 */
export const useCsrfToken = () => {
  const csrfToken = useState<string | null>(stateKey, () => null);
  const { register } = useCleaner();
  register(stateKey, clearToken);
  return {
    csrfTokenHeader: computed(() => {
      return csrfToken.value ? { "X-CSRF-Token": csrfToken.value } : {};
    }),
    setToken,
    clearToken,
  };
};
