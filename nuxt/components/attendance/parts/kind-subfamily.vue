<!-- 勤務内容・種別セレクタ -->

<script setup lang="ts">
import type { Option } from "composables/select-option";

interface Props {
  kind: number;
  subfamily: string;
  readonly: boolean;
}
const props = defineProps<Props>();

interface Emits {
  (e: "update:kind", value: number): void;
  (e: "update:subfamily", value: string): void;
}
const emits = defineEmits<Emits>();

const config = useAppConfig();
const { labels } = useLabel();
const { attendanceKinds, attendanceKindMap } = useAttendanceKind();
const { categoryMap } = useCategory();
const { createSelectOption } = useSelectOption();

const kindOptions = computed<Option[]>(() => createSelectOption(attendanceKinds.value, "name", "id"));
const attendanceKind = computed(() => attendanceKindMap.value[props.kind]!);
const subfamilies = computed(() => config.subfamilyMap[attendanceKind.value.family].map((it) => categoryMap.value.attendanceSubfamily.codeMap[it]!));
const subfamilyOptions = computed<Option[]>(() => createSelectOption(subfamilies.value, "name", "code"));

const kind = computed({
  get: () => props.kind?.toString() ?? "",
  set: (value) => emits("update:kind", Number(value)),
});

const subfamily = computed({
  get: () => props.subfamily,
  set: (value) => emits("update:subfamily", value),
});

onMounted(() => {
  const stop = watch(
    attendanceKind,
    (value) => {
      if (value.family === config.family.solo) {
        subfamily.value = config.subfamily.solo;
      } else if (props.subfamily === config.subfamily.solo) {
        subfamily.value = config.subfamily.plan;
      }
    },
    {
      immediate: true,
      deep: true,
    }
  );
  onScopeDispose(stop);
});
</script>

<template>
  <div>
    <v-select v-model="kind" :items="kindOptions" :label="labels.long.attendanceKind!" :readonly="readonly" />
    <v-select v-model="subfamily" :items="subfamilyOptions" :label="labels.long.subfamily!" :readonly="readonly" />
  </div>
</template>
