<!-- 備考／理由テキストエリア -->

<script setup lang="ts">
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

const message = computed(() => (props.necessary && !reason.value ? `${config.errorMark}${labels.value.long.required!}` : ""));

const reason = computed({
  get: () => props.modelValue,
  set: (value) => emits("update:modelValue", value),
});

const inputHandler = (e: Event) => {
  const element = e.target as HTMLTextAreaElement;
  if (config.maxReasonLength < element.value.length) {
    element.value = element.value.substring(0, config.maxReasonLength);
  }
  reason.value = element.value;
};
</script>

<template>
  <v-textarea
    v-model="reason"
    v-show="props.necessary"
    :counter="config.maxReasonLength"
    :error-messages="message"
    :persistent-counter="true"
    :label="labels.long.reason"
    @input="inputHandler"
  >
    <template #message="{ message:msg }">
      <span style="padding-left: 1em;">{{ msg }}</span>
    </template>
  </v-textarea>
</template>
