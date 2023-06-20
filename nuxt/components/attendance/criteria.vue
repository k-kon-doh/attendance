<!-- 勤怠検索条件 -->

<script setup lang="ts">
import type { Criteria } from "composables/list-condition";
import type { Option } from "composables/select-option";

interface Props {
  pending: boolean;
  criteria: Criteria;
}
const props = withDefaults(defineProps<Props>(), {
  pending: false,
  criteria: createListInitialCriteria,
});

interface Emits {
  (e: "search", value: Criteria): void;
}
const emits = defineEmits<Emits>();

const config = useAppConfig();
const { labels } = useLabel();
const { categoryMap } = useCategory();
const { attendanceKinds } = useAttendanceKind();
const { createSelectOption } = useSelectOption();

const statusOptions = computed<Option[]>(() => createSelectOption(categoryMap.value.attendanceStatus.members, "name", "code", true));
const kindOptions = computed<Option[]>(() => createSelectOption(attendanceKinds.value, "name", "id", true));

const validForm = ref<boolean | null>(null);
const criteria = ref<Criteria>({ ...props.criteria });

const clearHandler = () => {
  criteria.value = createListInitialCriteria();
};

const searchHandler = () => {
  if (validForm.value === false) {
    return;
  }
  emits("search", { ...criteria.value });
};
</script>

<template>
  <v-sheet class="mt-0 mb-2 px-2 py-4" elevation="3">
    <v-form v-model="validForm" :disabled="props.pending" @submit.prevent="searchHandler">
      <v-defaults-provider
        :defaults="{
          VSelect: { class: 'mb-2', density: 'default', dirty: true, hideDetails: 'auto', variant: 'underlined' },
          VTextField: { class: 'mb-2', density: 'default', dirty: true, hideDetails: 'auto', variant: 'underlined' },
        }"
      >
        <v-row>
          <v-col align-self="end" cols="6" sm="2">
            <v-select v-model="criteria.status" :items="statusOptions" :label="labels.long.status!" />
          </v-col>
          <v-col align-self="end" cols="6" sm="2">
            <v-select v-model="criteria.kind" :items="kindOptions" :label="labels.long.attendanceKind!" />
          </v-col>
          <v-col align-self="end" cols="6" sm="3">
            <date-field v-model="criteria.date" :label="labels.long.date" :necessary="config.necessary.optional" />
          </v-col>
          <v-col align-self="end" cols="6" sm="3">
            <date-field v-model="criteria.applicationDate" :label="labels.long.applicationDate" :necessary="config.necessary.optional" />
          </v-col>
          <v-col align-self="end" class="text-end" cols="12" sm="2">
            <v-btn block type="submit" :disabled="props.pending">{{ labels.long.search }}</v-btn>
            <v-btn block type="button" :disabled="props.pending" @click="clearHandler">{{ labels.long.clear }}</v-btn>
          </v-col>
        </v-row>
      </v-defaults-provider>
    </v-form>
  </v-sheet>
</template>

<style scoped></style>
