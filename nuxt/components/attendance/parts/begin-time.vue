<!-- 開始時間テキストボックス -->

<script setup lang="ts">
defineOptions({
  inheritAttrs: false,
});

interface Props {
  modelValue: string;
  necessary: string;
  range: boolean;
}
const props = defineProps<Props>();

interface Emits {
  (e: "update:modelValue", value: string): void;
}
const emits = defineEmits<Emits>();

const { labels } = useLabel();
const label = computed(() => (props.range ? labels.value.long.beginTime : labels.value.long.time));

const time = computed({
  get: () => props.modelValue,
  set: (value) => emits("update:modelValue", value),
});
</script>

<template>
  <time-field v-bind="$attrs" v-model="time" :necessary="props.necessary" :label="label" />
</template>
