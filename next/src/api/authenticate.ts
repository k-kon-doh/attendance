import { fetcher } from "@/api/fetcher";
import Config from "@/app.config";

/** ログイン社員型 */
export type LoginEmployee = {
  choiceId: string;
  name: string;
  organizationName: string;
  features: string[];
};

/** ログアウト社員 */
export const logoutEmployee: Readonly<LoginEmployee> = {
  choiceId: "",
  name: "",
  organizationName: "",
  features: [] as LoginEmployee["features"],
} as const;

/** ログイン */
export async function login(id: string, password: string, language: string) {
  return await fetcher<LoginEmployee>(`${Config.apiURL}/session`, {
    cache: "no-store",
    method: "post",
    credentials: "include",
    headers: { "content-type": "application/json", "accept-language": language },
    body: JSON.stringify({
      login_id: id,
      password,
    }),
  });
}

/** ログアウト */
export async function logout() {
  // TODO: サーバーAPIを叩いてセッション情報とセッションIDクッキーを消す。
  return Promise.resolve();
}
