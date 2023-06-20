<!-- 対象者選択セレクタ -->

<script setup lang="ts">
import type { Applicant } from "composables/attendance";

type Item = {
  myself: number;
  parent: number;
  children: number[];
  name: string;
  choiceId: string;
  choice: boolean;
  nOfChoices: number;
  indeterminate: boolean;
  disabled: boolean;
  style: string;
};

interface Props {
  applicants: Applicant[];
  readonly?: boolean;
  disabled?: boolean;
}
const props = defineProps<Props>();

interface Emits {
  (e: "select", value: { [chiceId: string]: boolean }): void;
}
const emits = defineEmits<Emits>();

const items = ref<Item[]>();

onMounted(() => {
  const stop = watch(props, createItems, {
    immediate: true,
    deep: false,
  });
  onScopeDispose(stop);
});

const createItems = (value: Props) => {
  let parent = -1;
  const entries: Item[] = [];
  const disabled = (value.disabled || value.readonly) ?? false;
  value.applicants.forEach((it, index) => {
    const style = `opacity: ${value.disabled ? 0.3 : 1}; text-indent: ${(it.hierarchy + (it.choiceId ? 2 : 0)) * 5}px;`;
    if (!it.choiceId) {
      // 組織
      entries.push({
        myself: index,
        parent: -1,
        children: [],
        name: it.organization,
        choiceId: "",
        choice: false,
        nOfChoices: 0,
        indeterminate: false,
        disabled: true,
        style,
      });
      parent = index;
    } else {
      // 社員
      entries.push({
        myself: index,
        parent,
        children: [],
        name: it.name,
        choiceId: it.choiceId,
        choice: it.choice,
        nOfChoices: it.choice ? 1 : 0,
        indeterminate: false,
        disabled,
        style,
      });
      const parentEntry = entries[parent]!;
      parentEntry.children.push(index);
      parentEntry.nOfChoices += it.choice ? 1 : 0;
      parentEntry.choice = 0 < parentEntry.nOfChoices;
      parentEntry.indeterminate = 0 < parentEntry.nOfChoices && parentEntry.children.length !== parentEntry.nOfChoices;
      parentEntry.disabled = disabled;
    }
  });
  items.value = entries;
};

const selectHandler = (value: { id: unknown; value: boolean; path: unknown[] }) => {
  const index = value.id as number;
  const entry = items.value?.at(index);
  if (!entry) {
    return;
  }
  const select = !entry.choice;
  let organizationEntry;
  if (entry.parent === -1) {
    organizationEntry = entry;
    organizationEntry.children.forEach((it) => {
      const chaildEntry = items.value?.at(it);
      if (!chaildEntry || chaildEntry.choice === select) {
        return;
      }
      chaildEntry.choice = select;
      chaildEntry.nOfChoices = select ? 1 : 0;
    });
  } else {
    entry.choice = select;
    entry.nOfChoices = select ? 1 : 0;
    organizationEntry = items.value?.at(entry.parent);
    if (!organizationEntry) {
      return;
    }
  }
  organizationEntry.nOfChoices = organizationEntry.children.reduce((acc, cur) => acc + (items.value?.at(cur)?.nOfChoices ?? 0), 0);
  organizationEntry.choice = 0 < organizationEntry.nOfChoices;
  organizationEntry.indeterminate = organizationEntry.choice && organizationEntry.children.length !== organizationEntry.nOfChoices;

  const choiceMap: { [choiceId: string]: boolean } = {};
  items.value?.filter((it) => !!it.choiceId).forEach((it) => (choiceMap[it.choiceId] = it.choice));
  emits("select", choiceMap);
};
</script>

<template>
  <v-list select-strategy="classic" v-if="items" @click:select="selectHandler">
    <v-list-item v-for="item in items" :active="false" :disabled="item.disabled" :key="item.myself" :style="item.style" :value="item.myself">
      <template v-if="!item.disabled" #append>
        <v-list-item-action>
          <v-checkbox-btn :model-value="item.choice" :indeterminate="item.indeterminate" />
        </v-list-item-action>
      </template>
      <span :class="{ 'font-weight-bold text-primary': item.parent === -1 }">{{ item.name }}</span>
    </v-list-item>
  </v-list>
</template>
