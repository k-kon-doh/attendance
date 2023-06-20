<!-- 機能選択タブ -->

<script setup lang="ts">
const { feature } = useFeature();

const { currentEmployee } = useAuthenticate();
const userFeatures = currentEmployee.value!.features;

const { categoryMap } = useCategory();
const tabs = computed(() => categoryMap.value.feature.members.filter((it) => userFeatures.includes(it.code)));
</script>

<template>
  <v-tabs bg-color="transparent" color="primary" grow v-model="feature">
    <v-tab v-for="tab in tabs" :key="tab.code" :value="tab.code">
      {{ tab.name }}
    </v-tab>
  </v-tabs>
</template>
