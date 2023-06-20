<!-- 個別勤怠情報：表示 -->

<script setup lang="ts">
const { labels } = useLabel();
const { addFlashMessageKey } = useFlashMessage();

let id = useRoute().params.id;
if (!id || typeof id !== "string") {
  id = "";
  addFlashMessageKey("invalidId", "error");
  useRouter().back();
}

const { findById } = useAttendance();
const { data: attendance, error } = await findById(id, "show", !!id);
if (error.value) {
  addFlashMessageIfError(error);
  useRouter().back();
}
</script>

<template>
  <h1>{{ labels.long.show }}</h1>
  <attendance-detail action="show" v-if="attendance" :attendance="attendance" :pending="false" />
</template>
