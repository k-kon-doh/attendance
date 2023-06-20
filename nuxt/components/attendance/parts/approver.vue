<!-- 承認者選択セレクタ -->

<script setup lang="ts">
import type { Approver } from "composables/approver";
import type { Employee } from "composables/attendance";

interface Props {
  modelValue: Employee;
}
const props = defineProps<Props>();

interface Emits {
  (e: "update:modelValue", value: Employee): void;
}
const emits = defineEmits<Emits>();

const config = useAppConfig();
const { labels } = useLabel();

const message = computed(() => (!pending.value && !approver.value ? `${config.errorMark}${labels.value.long.required!}` : ""));

const { data, pending } = useApprover(true);
const approvers = computed<Approver[]>(() => data.value ?? []);

const approver = computed({
  get: () => (pending.value ? "" : props.modelValue.choiceId ?? ""),
  set: (value) => {
    const name = approvers.value.find((it) => it.choiceId === value)?.name ?? "";
    emits("update:modelValue", { choiceId: value, name });
  },
});

const items = computed(() => [
  { title: "", value: "", disabled: false, style: "" },
  ...approvers.value.map((it) => {
    const style = `opacity: 1; text-indent: ${(it.hierarchy + (it.choiceId ? 2 : 0)) * 5}px;`;
    if (!it.choiceId) {
      return { title: it.organization, value: "", disabled: true, style };
    }
    return { title: it.name, value: it.choiceId, disabled: false, style };
  }),
]);
</script>

<template>
  <v-select item-props v-model="approver" :error-messages="message" :items="items" :label="labels.long.approver!">
    <template #item="{item, props:itemProps}">
      <v-list-item :disabled="item.props.disabled" :style="item.props.style" @click="itemProps.onClick">
        <span :class="{ 'font-weight-bold text-primary': item.props.disabled }">{{ item.title }}</span>
      </v-list-item>
    </template>
    <template #message="{ message:msg }">
      <span style="padding-left: 1em;">{{ msg }}</span>
    </template>
  </v-select>
</template>
