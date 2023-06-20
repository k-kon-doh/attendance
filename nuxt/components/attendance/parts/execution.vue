<!-- 申請種類・実施状態セレクタ -->

<script setup lang="ts">
import type { Option } from "composables/select-option";

interface Props {
  modelValue: string;
}
const props = defineProps<Props>();

interface Emits {
  (e: "update:modelValue", value: string): void;
}
const emits = defineEmits<Emits>();

const { labels } = useLabel();
const { categoryMap } = useCategory();
const { createSelectOption } = useSelectOption();
const options = computed<Option[]>(() => createSelectOption(categoryMap.value.attendanceExecution.members, "name", "code"));

const execution = computed({
  get: () => props.modelValue,
  set: (value) => emits("update:modelValue", value),
});
</script>

<template>
  <v-select v-model="execution" :items="options" :label="labels.long.execution!" />
</template>
