"use client";

import { Checkbox, FormHelperText, List, ListItem, ListItemButton, ListItemSecondaryAction, ListItemText, ListProps } from "@mui/material";
import { useAtomValue } from "jotai";
import { memo, useCallback, useMemo } from "react";

import { Applicant, ChoiceMap } from "@/api/attendance";
import Config, { NecessaryValue } from "@/app.config";
import { labelsAtom } from "@/composables/label";
import useNecessary from "@/composables/necessary";

/** 対象者セレクタのプロパティ型 */
type MembersSelectorProps = Omit<ListProps, "label" | "onChange"> & {
  disabled?: boolean;
  necessary?: boolean | NecessaryValue;
  onChange?: (value: ChoiceMap) => void;
  readonly?: boolean;
  value: readonly Applicant[];
};

/** リストアイテム型 */
type Item = {
  id: number;
  parent: number;
  children: number[];
  name: string;
  choiceId: string;
  choice: boolean;
  nOfChoices: number;
  indeterminate: boolean;
  disabled: boolean;
  sx: Record<string, string | number>;
  primaryTypographyProps: Record<string, string | number>;
};

/** リストアイテムを生成 */
function createItems(
  applicantsOfProps: MembersSelectorProps["value"],
  disabledOfProps: MembersSelectorProps["disabled"],
  readonlyOfProps: MembersSelectorProps["readonly"]
) {
  let parent = -1;
  const entries: Item[] = [];
  const disabled = (disabledOfProps || readonlyOfProps) ?? false;
  applicantsOfProps.forEach((it, index) => {
    const sx = { opacity: disabledOfProps ? 0.3 : 1, textIndent: `${(it.hierarchy + (it.choiceId ? 2 : 0)) * 5}px;` };
    if (!it.choiceId) {
      // 組織
      entries.push({
        id: index,
        parent: -1, // 常に-1(組織の階層は追跡しない)
        children: [], // 社員のみ
        name: it.organization,
        choiceId: "",
        choice: false,
        nOfChoices: 0,
        indeterminate: false,
        disabled: true,
        sx,
        primaryTypographyProps: { color: "primary.main", fontWeight: "bold" },
      });
      parent = index;
    } else {
      // 社員
      entries.push({
        id: index,
        parent, // 社員が所属する組織
        children: [], // 常に空
        name: it.name,
        choiceId: it.choiceId,
        choice: it.choice,
        nOfChoices: it.choice ? 1 : 0,
        indeterminate: false,
        disabled: disabled,
        sx,
        primaryTypographyProps: {},
      });
      const parentEntry = entries[parent]!;
      parentEntry.children.push(index);
      parentEntry.nOfChoices += it.choice ? 1 : 0;
      parentEntry.choice = 0 < parentEntry.nOfChoices;
      parentEntry.indeterminate = 0 < parentEntry.nOfChoices && parentEntry.children.length !== parentEntry.nOfChoices;
      parentEntry.disabled = disabled;
    }
  });
  return entries;
}

/** 選択状態トグル */
function toggle(items: Item[], index: number) {
  const entry = items[index];
  if (!entry) {
    return;
  }
  const select = !entry.choice;
  let organizationEntry;
  if (entry.parent === -1) {
    // 組織
    organizationEntry = entry;
    organizationEntry.children.forEach((it) => {
      const chaildEntry = items[it];
      if (!chaildEntry || chaildEntry.choice === select) {
        return;
      }
      chaildEntry.choice = select;
      chaildEntry.nOfChoices = select ? 1 : 0;
    });
  } else {
    // 社員
    entry.choice = select;
    entry.nOfChoices = select ? 1 : 0;
    organizationEntry = items[entry.parent];
    if (!organizationEntry) {
      return;
    }
  }
  organizationEntry.nOfChoices = organizationEntry.children.reduce((acc, cur) => acc + (items[cur]?.nOfChoices ?? 0), 0);
  organizationEntry.choice = 0 < organizationEntry.nOfChoices;
  organizationEntry.indeterminate = organizationEntry.choice && organizationEntry.children.length !== organizationEntry.nOfChoices;
}

/** 対象者セレクタ */
function MemberSelector({ disabled, necessary, onChange, readonly, value, ...restProps }: MembersSelectorProps) {
  const labels = useAtomValue(labelsAtom);

  const items = useMemo(() => createItems(value, disabled, readonly), [disabled, readonly, value]);

  const [show, required] = useNecessary(necessary);
  const numOfSelected = useMemo(() => items.reduce((acc, it) => acc + (it.choice ? 1 : 0), 0), [items]);
  const error = useMemo(() => !!required && !numOfSelected && !readonly, [numOfSelected, readonly, required]);
  const message = useMemo(() => (error ? `${Config.errorMark}${labels.long.required!}` : " "), [error, labels.long.required]);

  const selectHandler = useCallback(
    (id: number) => {
      toggle(items, id);
      onChange?.(Object.fromEntries(items.filter((it) => !!it.choiceId).map((it) => [it.choiceId, it.choice])));
    },
    [items, onChange]
  );

  if (!show) return null;
  return (
    <>
      <List {...restProps}>
        {items.map((it) => (
          <ListItem disablePadding key={it.id}>
            {it.disabled ? (
              <ListItemText sx={it.sx} primaryTypographyProps={it.primaryTypographyProps}>
                {it.name}
              </ListItemText>
            ) : (
              <ListItemButton onClick={() => selectHandler(it.id)} sx={{ paddingLeft: 0 }}>
                <ListItemText sx={it.sx} primaryTypographyProps={it.primaryTypographyProps}>
                  {it.name}
                </ListItemText>
                <ListItemSecondaryAction>
                  <Checkbox edge="end" checked={it.choice} indeterminate={it.indeterminate} />
                </ListItemSecondaryAction>
              </ListItemButton>
            )}
          </ListItem>
        ))}
      </List>
      <FormHelperText error={error}>{message}</FormHelperText>
    </>
  );
}
export default memo(MemberSelector);
