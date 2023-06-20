<!-- 個別勤怠情報：作成 -->

<script setup lang="ts">
import type { Attendance } from "composables/attendance";

const config = useAppConfig();
const { labels } = useLabel();
const { addFlashMessageKey } = useFlashMessage();
const { create, save } = useAttendance();

const { data: attendance, error } = await create(true);
if (error.value) {
  addFlashMessageIfError(error);
  useRouter().back();
}

const pending = ref(false);

const applyHandler = (value: Attendance) => {
  pending.value = true;
  value.status = config.status.applying;
  save(value, true).then(({ data, error: saveError }) => {
    addFlashMessageIfError(saveError);
    if (!saveError.value && data.value) {
      addFlashMessageKey("successAttendanceApply", "success");
      navigateTo(`/attendances/${data.value.id}`, { replace: true });
    }
    pending.value = false;
  });
};

const saveHandler = (value: Attendance) => {
  pending.value = true;
  value.status = config.status.making;
  save(value, true).then(({ data, error: saveError }) => {
    addFlashMessageIfError(saveError.value);
    if (!saveError.value && data.value) {
      addFlashMessageKey("successAttendanceRegister", "success");
      navigateTo(`/attendances/${data.value.id}/edit`, { replace: true });
    }
    pending.value = false;
  });
};
</script>

<template>
  <h1>{{ labels.long.new }}</h1>
  <attendance-detail action="new" v-if="attendance" :attendance="attendance" :pending="pending">
    <template #actions="{ valid, value }">
      <v-col class="text-left">
        <v-btn size="x-large" :disabled="pending || !valid" :loading="pending" @click="applyHandler(value)">{{ labels.long.apply }}</v-btn>
      </v-col>
      <v-col class="text-center">
        <v-btn size="x-large" :disabled="pending" :loading="pending" @click="saveHandler(value)">{{ labels.long.save }}</v-btn>
      </v-col>
    </template>
  </attendance-detail>
</template>
