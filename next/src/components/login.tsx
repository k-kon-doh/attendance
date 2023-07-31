"use client";

import { Button, Card, CardActions, CardContent, Container, TextField } from "@mui/material";
import { useAtomValue } from "jotai";
import { useEffect, useState } from "react";

import useAuthenticate from "@/composables/authenticate";
import { initialize as initializeCriteria } from "@/composables/criteria";
import { initialize as initializeFeature } from "@/composables/feature";
import { addFlashMessage } from "@/composables/flash-message";
import { labelsAtom } from "@/composables/label";
import { messagesAtom } from "@/composables/message";
import { useRouter } from "@/composables/router";

/** ログインフォーム */
export default function Login() {
  const router = useRouter();
  const labels = useAtomValue(labelsAtom);
  const messages = useAtomValue(messagesAtom);
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const { login, logout } = useAuthenticate();

  const changeUserIdHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUserId(event.target.value);
  };
  const changePasswordHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };
  const submitHandler = (e: React.MouseEvent<HTMLFormElement>) => {
    login(userId, password)
      .then((it) => {
        if (it) router.push("/attendances");
      })
      .catch((error) => addFlashMessage(error.message, "error"));
    e.preventDefault();
  };

  useEffect(() => {
    logout();
    initializeFeature();
    initializeCriteria();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Container maxWidth="md">
      <Card className="max-w-md mx-auto mt-10" raised>
        <form onSubmit={submitHandler}>
          <CardContent className="space-y-10">
            <TextField
              className="w-full"
              InputLabelProps={{ shrink: true }}
              label={labels.long.loginId}
              onChange={changeUserIdHandler}
              placeholder={messages.plsInputLoginId ?? ""}
              required
              variant="outlined"
            />
            <TextField
              className="w-full"
              InputLabelProps={{ shrink: true }}
              label={labels.long.password}
              onChange={changePasswordHandler}
              placeholder={messages.plsInputPassword ?? ""}
              required
              type="password"
              variant="outlined"
            />
          </CardContent>
          <CardActions sx={{ margin: "16px 0", padding: "8px 16px" }}>
            <Button className="w-full" color="secondary" type="submit" variant="outlined">
              {labels.long.login}
            </Button>
          </CardActions>
        </form>
      </Card>
    </Container>
  );
}
