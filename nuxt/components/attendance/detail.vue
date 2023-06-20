<!-- 勤怠詳細情報 -->

<script setup lang="ts">
import type { Attendance } from "composables/attendance";

type Action = "new" | "show" | "edit" | "approve";

interface Props {
  action: Action;
  attendance: Attendance;
  pending: boolean;
}
const props = defineProps<Props>();

const config = useAppConfig();
const { labels } = useLabel();
const { messages } = useMessage();
const { feature } = useFeature();

const attendance = ref<Attendance>({ ...props.attendance });

const { attendanceKindMap } = useAttendanceKind();
const kind = computed(() => attendanceKindMap.value[attendance.value.attendanceKindId]!);

const dateRange = computed(() => kind.value.endDate !== config.necessary.notNeeded);
const timeRange = computed(() => kind.value.endTime !== config.necessary.notNeeded);

const showMembers = computed(() => feature.value !== config.features.selfApply);
const colSize = computed(() => (showMembers.value ? 4 : 6));

const notEditable = computed(() => ["show", "approve"].includes(props.action) || props.attendance.status !== config.status.making);
const approvable = computed(() => props.action === "approve" && props.attendance.status === config.status.applying);
const approved = computed(() => props.attendance.status === config.status.accepted || props.attendance.status === config.status.rejected);

const dateErrorMessage = ref("");
const timeErrorMessage = ref("");
const validForm = ref(false);
const valid = computed(() => {
  dateErrorMessage.value = "";
  timeErrorMessage.value = "";
  if (dateRange.value && attendance.value.beginDate && attendance.value.endDate) {
    if (attendance.value.endDate <= attendance.value.beginDate) {
      dateErrorMessage.value = messages.value.reversedDate!;
    }
  }
  if (!dateRange.value && timeRange.value && attendance.value.beginTime && attendance.value.endTime) {
    if (attendance.value.endTime <= attendance.value.beginTime) {
      timeErrorMessage.value = messages.value.reversedTime!;
    }
  }
  return validForm.value && !dateErrorMessage.value && !timeErrorMessage.value;
});

onMounted(() => {
  const stop = watch(
    () => props.attendance,
    (value) => {
      attendance.value = { ...value };
    }
  );
  onScopeDispose(stop);
});

const selectHandler = (value: { [choiceId: string]: boolean }) => {
  attendance.value.applicants.forEach((it) => {
    if (it.choiceId) {
      it.choice = value[it.choiceId] ?? false;
    }
  });
};

const backHandler = () => {
  useRouter().back();
};
</script>

<template>
  <v-row>
    <v-col>
      <v-card class="px-6 py-4" elevation="3">
        <v-form :disabled="props.pending" :readonly="props.action == 'show'" v-model="validForm">
          <v-defaults-provider
            :defaults="{
              VSelect: { class: 'mb-2', density: 'default', dirty: true, hideDetails: 'auto', variant: 'underlined' },
              VTextarea: { class: 'mb-2', density: 'default', dirty: true, hideDetails: 'auto', rows: 2, variant: 'underlined' },
              VTextField: { class: 'mb-2', density: 'default', dirty: true, hideDetails: 'auto', variant: 'underlined' },
            }"
          >
            <v-row>
              <v-col cols="12" :sm="colSize" v-if="showMembers">
                <attendance-parts-members :applicants="attendance.applicants" :disabled="props.pending" :readonly="notEditable" @select="selectHandler" />
              </v-col>
              <v-col cols="12" :sm="colSize">
                <attendance-parts-status :value="attendance.status" />
                <attendance-parts-kind-subfamily v-model:kind="attendance.attendanceKindId" v-model:subfamily="attendance.subfamily" :readonly="notEditable" />
                <attendance-parts-execution v-model="attendance.execution" :readonly="notEditable" />
                <attendance-parts-begin-date
                  v-model="attendance.beginDate"
                  :disabled="props.pending"
                  :error-message="dateErrorMessage"
                  :necessary="kind.beginDate"
                  :range="dateRange"
                  :readonly="notEditable"
                />
                <attendance-parts-begin-time
                  v-model="attendance.beginTime"
                  :disabled="props.pending"
                  :error-message="timeErrorMessage"
                  :necessary="kind.beginTime"
                  :range="timeRange"
                  :readonly="notEditable"
                />
                <attendance-parts-end-date v-model="attendance.endDate" :disabled="props.pending" :necessary="kind.endDate" :readonly="notEditable" />
                <attendance-parts-end-time v-model="attendance.endTime" :disabled="props.pending" :necessary="kind.endTime" :readonly="notEditable" />
                <attendance-parts-shift v-model="attendance.shift" :necessary="kind.shift" :readonly="notEditable" />
                <attendance-parts-reason v-model="attendance.reason" :necessary="kind.reason" :readonly="notEditable" />
              </v-col>
              <v-col cols="12" :sm="colSize">
                <attendance-parts-agent :value="attendance.agent" />
                <attendance-parts-application-date :value="attendance.applicationDate" />
                <attendance-parts-approval-date readonly :value="attendance.approvalDate" />
                <attendance-parts-approver v-model="attendance.approver" :readonly="notEditable" />
                <attendance-parts-approval-comment v-model="attendance.approvalComment" v-show="approvable || approved" :readonly="approved" />
              </v-col>
            </v-row>
          </v-defaults-provider>
          <v-row>
            <slot name="actions" :valid="valid" :value="{ ...attendance }"></slot>
            <v-col class="text-right">
              <v-btn size="x-large" type="button" :loading="props.pending" @click="backHandler">{{ labels.long.back }}</v-btn>
            </v-col>
          </v-row>
        </v-form>
      </v-card>
    </v-col>
  </v-row>
</template>

<style scoped></style>
