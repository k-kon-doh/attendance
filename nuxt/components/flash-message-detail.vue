<!-- 個別フラッシュメッセージ -->

<script setup lang="ts">
import type { DeepReadonly } from "vue";
import type { Message } from "composables/flash-message";

interface Props {
  message: DeepReadonly<Message>;
}
const props = defineProps<Props>();

interface Emits {
  (e: "remove", id: number): void;
}
const emits = defineEmits<Emits>();

onMounted(() => {
  const timerId = window.setTimeout(() => {
    emits("remove", props.message.id);
  }, props.message.timeout);
  onScopeDispose(() => window.clearTimeout(timerId));
});
</script>

<template>
  <v-card class="pa-1 mb-1" :class="`bg-${props.message.type}`">
    <p v-for="(text, index) in props.message.contents" :key="index">{{ text }}</p>
  </v-card>
</template>
