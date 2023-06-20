<!-- 勤怠情報：機能タブ＆リスト -->

<script setup lang="ts">
const config = useAppConfig();
const { feature } = useFeature();

const showFab = computed(() => feature.value === config.features.selfApply || feature.value === config.features.representativeApply);
const component = computed(() =>
  feature.value === config.features.masterMaintain ? resolveComponent("MasterMaintenance") : resolveComponent("AttendanceList")
);

const clickHandler = () => {
  navigateTo("/attendances/new");
};
</script>

<template>
  <div class="v-layout--full-height">
    <feature-tab v-model="feature" />
    <component :is="component" :key="feature" />
    <new-fab v-show="showFab" @click="clickHandler" />
  </div>
</template>
