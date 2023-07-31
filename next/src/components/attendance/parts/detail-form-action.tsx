import { Stack } from "@mui/material";

import { Attendance } from "@/api/attendance";
import ProgressButton from "@/components/parts/progress-button";

export type CreateElementFunction = (attendance: Attendance, valid: boolean) => JSX.Element;

/** アクションボタン型 */
type Action = {
  label: string;
  onClick: (attendance: Attendance) => () => void;
  valid: boolean;
};

/** 戻るボタン型 */
type BackAction = {
  label: string;
  onClick: () => void;
};

/** アクションボタン要素を作成するファンクションを生成 */
export function createActionFunction(action1: Action, action2: Action, back: BackAction, pending: boolean): CreateElementFunction {
  return function action(attendance: Attendance, valid: boolean) {
    return (
      <Stack direction="row" justifyContent="space-between">
        <ProgressButton disabled={pending || (action1.valid && !valid)} onClick={action1.onClick(attendance)} pending={pending} variant="outlined">
          {action1.label}
        </ProgressButton>
        <ProgressButton disabled={pending || (action2.valid && !valid)} onClick={action2.onClick(attendance)} pending={pending} variant="outlined">
          {action2.label}
        </ProgressButton>
        <ProgressButton disabled={pending} onClick={back.onClick} pending={pending} variant="outlined">
          {back.label}
        </ProgressButton>
      </Stack>
    );
  };
}

/** 戻るボタン要素を作成するファンクションを生成 */
export function createBackActionFunction(back: BackAction, pending: boolean): CreateElementFunction {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  return function action(_attendance: Attendance, _valid: boolean) {
    return (
      <Stack direction="row" justifyContent="space-between">
        <div />
        <div />
        <ProgressButton disabled={pending} onClick={back.onClick} pending={pending} variant="outlined">
          {back.label}
        </ProgressButton>
      </Stack>
    );
  };
}
