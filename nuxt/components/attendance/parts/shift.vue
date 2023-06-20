<!-- 勤務形態セレクタ -->

<script setup lang="ts">
import type { Option } from "composables/select-option";

interface Props {
  modelValue: string;
  necessary: boolean;
}
const props = defineProps<Props>();

interface Emits {
  (e: "update:modelValue", value: string): void;
}
const emits = defineEmits<Emits>();

const config = useAppConfig();
const { labels } = useLabel();
const { categoryMap } = useCategory();

const message = computed(() => (props.necessary && !shift.value ? `${config.errorMark}${labels.value.long.required!}` : ""));

const { createSelectOption } = useSelectOption();
const options = computed<Option[]>(() => createSelectOption(categoryMap.value.shift.members, "name", "code", true));

const shift = computed({
  get: () => props.modelValue,
  set: (value) => emits("update:modelValue", value),
});
</script>

<template>
  <v-select v-model="shift" v-show="props.necessary" :error-messages="message" :items="options" :label="labels.long.shift!">
    <template #message="{ message:msg }">
      <span style="padding-left: 1em;">{{ msg }}</span>
    </template>
  </v-select>
</template>
