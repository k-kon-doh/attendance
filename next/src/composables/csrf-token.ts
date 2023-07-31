import { proxy } from "valtio";

type CsrfTokenState = {
  value: string;
};

/** クロスサイトリクエストフォージェリトークン */
export const csrfTokenState = proxy<CsrfTokenState>({ value: "" });
