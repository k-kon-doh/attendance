<!-- 代理申請者テキストボックス（表示専用） -->

<script setup lang="ts">
import type { Employee } from "composables/attendance";

interface Props {
  value: Employee;
}
const props = defineProps<Props>();

const { labels } = useLabel();
</script>

<template>
  <v-text-field readonly v-show="props.value.choiceId" :label="labels.long.agent" :value="props.value.name" />
</template>
