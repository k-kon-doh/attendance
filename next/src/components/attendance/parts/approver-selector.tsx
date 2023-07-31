"use client";

import { MenuItem, styled } from "@mui/material";
import { useAtomValue } from "jotai";
import { memo, useCallback, useEffect, useMemo, useState } from "react";
import { useSnapshot } from "valtio";

import { Approver } from "@/api/approver";
import { Employee } from "@/api/attendance";
import Select, { SelectProps } from "@/components/parts/select";
import useApprover from "@/composables/approver";
import { currentEmployeeState } from "@/composables/authenticate";
import { addFlashMessage } from "@/composables/flash-message";
import { labelsAtom } from "@/composables/label";
import { useRouter } from "@/composables/router";

/** 承認者セレクタのプロパティ型 */
type ApproverSelectorProps = Omit<SelectProps, "label" | "onChange" | "value"> & {
  onChange?: (value: Employee) => void;
  value: Employee;
};

/** 組織表示用メニューアイテム */
const OrganizationItem = styled(MenuItem)(({ theme }) => ({
  color: theme.palette.primary.main,
  "&.Mui-disabled": {
    opacity: 1,
  },
}));

/** 承認者セレクタ */
function ApproverSelector({ onChange, value, ...restProps }: ApproverSelectorProps) {
  const router = useRouter();
  const labels = useAtomValue(labelsAtom);
  const currentEmployee = useSnapshot(currentEmployeeState);

  const { find } = useApprover();
  const [approvers, setApprovers] = useState<Approver[]>([]);

  const items = useMemo(
    () => [
      { index: -1, title: "", value: "", approver: true, sx: {} },
      ...approvers.map((it, index) => {
        const sx = { textIndent: `${(it.hierarchy + (it.choiceId ? 2 : 0)) * 5}px;` };
        if (!it.choiceId) {
          return { index, title: it.organization, value: "", approver: false, sx };
        }
        return { index, title: it.name, value: it.choiceId, approver: true, sx };
      }),
    ],
    [approvers]
  );

  const changeHandler = useCallback(
    (value: string) => {
      const name = approvers.find((it) => it.choiceId === value)?.name ?? "";
      const employee = { choiceId: value, name };
      onChange?.(employee);
    },
    [approvers, onChange]
  );

  useEffect(() => {
    find().then(
      (data) => setApprovers(data),
      (error) => {
        addFlashMessage(error.message, "error");
        router.replace("/");
      }
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentEmployee.choiceId]);

  return (
    <Select fullWidth label={labels.long.approver!} onChange={changeHandler} value={value.choiceId} {...restProps}>
      {items.map((it) =>
        it.approver ? (
          <MenuItem key={it.index} sx={it.sx} value={it.value}>
            {it.title ? it.title : <span style={{ minHeight: "1rem" }}></span>}
          </MenuItem>
        ) : (
          <OrganizationItem disabled key={it.index} sx={it.sx}>
            {it.title}
          </OrganizationItem>
        )
      )}
    </Select>
  );
}
export default memo(ApproverSelector);
