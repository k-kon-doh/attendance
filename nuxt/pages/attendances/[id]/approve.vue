<!-- 個別勤怠情報：承認 -->

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

const acceptHandler = (value: Attendance) => {
  pending.value = true;
  value.status = config.status.accepted;
  save(value, true).then(({ data, error: saveError }) => {
    addFlashMessageIfError(saveError);
    if (!saveError.value && data.value) {
      addFlashMessageKey("successAttendanceAccept", "success");
      navigateTo(`/attendances/${data.value.id}`, { replace: true });
    }
    pending.value = false;
  });
};

const rejectHandler = (value: Attendance) => {
  pending.value = true;
  value.status = config.status.rejected;
  save(value, true).then(({ data, error: saveError }) => {
    addFlashMessageIfError(saveError);
    if (!saveError.value && data.value) {
      addFlashMessageKey("successAttendanceReject", "warning");
      navigateTo(`/attendances/${data.value.id}`, { replace: true });
    }
    pending.value = false;
  });
};
</script>

<template>
  <h1>{{ labels.long.approve }}</h1>
  <attendance-detail action="approve" v-if="attendance" :attendance="attendance" :pending="pending">
    <template #actions="{ value }">
      <v-col class="text-left">
        <v-btn size="x-large" :disabled="pending" :loading="pending" @click="acceptHandler(value)">{{ labels.long.accept }}</v-btn>
      </v-col>
      <v-col class="text-center">
        <v-btn size="x-large" :disabled="pending" :loading="pending" @click="rejectHandler(value)">{{ labels.long.reject }}</v-btn>
      </v-col>
    </template>
  </attendance-detail>
</template>
