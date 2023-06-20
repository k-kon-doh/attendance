<!-- 承認コメントテキストエリア -->

<script setup lang="ts">
interface Props {
  modelValue: string;
}
const props = defineProps<Props>();

interface Emits {
  (e: "update:modelValue", value: string): void;
}
const emits = defineEmits<Emits>();

const config = useAppConfig();
const { labels } = useLabel();

const comment = computed({
  get: () => props.modelValue,
  set: (value) => emits("update:modelValue", value),
});

const inputHandler = (e: Event) => {
  const element = e.target as HTMLTextAreaElement;
  if (config.maxCommentLength < element.value.length) {
    element.value = element.value.substring(0, config.maxCommentLength);
  }
  comment.value = element.value;
};
</script>

<template>
  <v-textarea v-model="comment" :counter="config.maxCommentLength" :persistent-counter="true" :label="labels.long.approvalComment" @input="inputHandler" />
</template>
