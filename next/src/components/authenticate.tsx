"use client";

import { Button } from "@mui/material";
import { useAtomValue } from "jotai";
import { useSnapshot } from "valtio";

import useAuthenticate, { currentEmployeeState } from "@/composables/authenticate";
import { labelsAtom } from "@/composables/label";
import { useRouter } from "@/composables/router";

/** ログイン中の社員情報（組織名：社員名 ログアウトボタン） */
export default function LoginEmployee() {
  const router = useRouter();
  const labels = useAtomValue(labelsAtom);
  const currentEmployee = useSnapshot(currentEmployeeState);

  const { logout } = useAuthenticate();
  const logoutHandler = () => {
    logout();
    router.replace("/");
  };

  if (!currentEmployee.isLogin) return null;
  return (
    <>
      <span>
        {currentEmployee.organizationName}
        {" : "}
        {currentEmployee.name}
      </span>
      <Button className="text-white" color="inherit" onClick={logoutHandler} variant="text">
        {labels.long.logout}
      </Button>
    </>
  );
}
