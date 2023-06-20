<!-- 申請状態テキストボックス（表示専用） -->

<script setup lang="ts">
interface Props {
  value: string;
}
const props = defineProps<Props>();

const { labels } = useLabel();
const { categoryMap } = useCategory();

const statusName = computed(() => categoryMap.value.attendanceStatus.codeMap[props.value]!.name);
</script>

<template>
  <v-text-field readonly :label="labels.long.status!" :value="statusName" />
</template>
