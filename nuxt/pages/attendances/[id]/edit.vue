<!-- 個別勤怠情報：編集-->

<script setup lang="ts">
import type { Attendance } from "composables/attendance";

const config = useAppConfig();
const { labels } = useLabel();
const { addFlashMessageKey } = useFlashMessage();

let id = useRoute().params.id;
if (!id || typeof id !== "string") {
  id = "";
  addFlashMessageKey("invalidId", "error");
  useRouter().back();
}

const { findById, save } = useAttendance();
const { data: attendance, error } = await findById(id, "edit", !!id);
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
    addFlashMessageIfError(saveError);
    if (!saveError.value && data.value) {
      addFlashMessageKey("successAttendanceRegister", "success");
      attendance.value = data.value;
    }
    pending.value = false;
  });
};
</script>

<template>
  <h1>{{ labels.long.edit }}</h1>
  <attendance-detail action="edit" v-if="attendance" :attendance="attendance" :pending="pending">
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
