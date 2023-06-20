<!-- 終了日付テキストボックス -->

<script setup lang="ts">
defineOptions({
  inheritAttrs: false,
});

interface Props {
  modelValue: string | null;
  necessary: string;
}
const props = defineProps<Props>();

interface Emits {
  (e: "update:modelValue", value: string | null): void;
}
const emits = defineEmits<Emits>();

const { labels } = useLabel();

const date = computed({
  get: () => props.modelValue,
  set: (value) => emits("update:modelValue", value),
});
</script>

<template>
  <date-field v-bind="$attrs" v-model="date" :necessary="props.necessary" :label="labels.long.endDate" />
</template>
