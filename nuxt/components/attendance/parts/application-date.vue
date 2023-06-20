<!-- 申請日付テキストボックス（表示専用） -->

<script setup lang="ts">
interface Props {
  value: string | null;
}
const props = defineProps<Props>();

const { labels } = useLabel();
</script>

<template>
  <v-text-field readonly v-show="props.value" :label="labels.long.applicationDate" :value="props.value" />
</template>
