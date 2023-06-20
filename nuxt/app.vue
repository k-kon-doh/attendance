<script setup lang="ts">
const { startWatch: watchLabel } = useLabel();
const { startWatch: watchMessage } = useMessage();
const { startWatch: watchCategory } = useCategory();
const { startWatch: watchKind } = useAttendanceKind();

watchLabel();
watchMessage();
watchCategory();
watchKind();

onMounted(() => {
  const { getPrimaryLanguage } = useAcceptLanguage();
  const intervalId = setInterval(getPrimaryLanguage, 2000);
  onScopeDispose(() => clearInterval(intervalId));
});
</script>

<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
