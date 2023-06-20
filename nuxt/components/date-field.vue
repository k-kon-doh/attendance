<!-- 日付テキストボックス -->

<script setup lang="ts">
import { mdiCalendar } from "@mdi/js";
import Datepicker from "@vuepic/vue-datepicker";
import "@vuepic/vue-datepicker/dist/main.css";

defineOptions({
  inheritAttrs: false,
});

interface Props {
  modelValue: string | null;
  necessary: string;
  readonly?: boolean | undefined;
  disabled?: boolean | undefined;
  errorMessage?: string | undefined;
}
const props = defineProps<Props>();

interface Emits {
  (e: "update:modelValue", value: string | null): void;
}
const emits = defineEmits<Emits>();

const config = useAppConfig();
const { labels } = useLabel();

const invalidPattern = new RegExp(String.raw`[^${config.dateDelimiters}\d\s]`);
const splitPattern = new RegExp(String.raw`[${config.dateDelimiters}]`);

const show = computed(() => props.necessary !== config.necessary.notNeeded);
const required = computed(() => props.necessary === config.necessary.required);
const message = computed(() => {
  let value = "";
  if (currentValid.value) {
    value = props.errorMessage ? `${config.errorMark}${props.errorMessage}` : "";
  } else {
    value = required.value ? `${config.errorMark}${labels.value.long.required} YYYYMMDD` : "YYYYMMDD";
  }
  return value;
});

const focus = ref(false);
const editing = computed(() => !props.readonly && !props.disabled && show.value && focus.value);

const showValid = ref(false);
const showValue = ref("");

const editValid = computed(() => (!required.value && !editValue.value) || (!!editValue.value && validateYMD(adjustYMD(extractYMD(editValue.value)))));
const editValue = ref("");

const currentValid = computed(() => (editing.value ? editValid.value : showValid.value));
const currentValue = computed({
  get: () => (editing.value ? editValue.value : showValue.value),
  set: (value) => (editValue.value = value),
});

onMounted(() => {
  const stop = watch(
    props,
    (propsValue) => {
      const normalizedValue = propsValue.modelValue?.trim() ?? "";
      showValid.value = false;
      showValue.value = normalizedValue;
      editValue.value = "";
      if (!normalizedValue) {
        showValid.value = !required.value;
        return;
      }
      if (invalidPattern.test(normalizedValue)) {
        return;
      }
      const elements = normalizedValue.replace(/\s/g, "").split(splitPattern).reverse();
      if (3 < elements.length) {
        return;
      }
      const ymd = adjustYMD(extractYMD(elements));
      if (!validateYMD(ymd)) {
        return;
      }
      showValid.value = true;
      editValue.value = toStringYMD(ymd);
    },
    {
      immediate: true,
      deep: false,
    }
  );
  onScopeDispose(stop);
});

const extractYMD = (value: string | string[]): [number, number, number] => {
  const aValue = typeof value === "string" ? value : value.length === 1 ? value[0] : null;
  return aValue
    ? [Number(aValue.slice(0, -4)) || 0, Number(aValue.slice(-4, -2)) || 0, Number(aValue.slice(-2)) || 0]
    : [Number(value[2]) || 0, Number(value[1]) || 0, Number(value[0]) || 0];
};

const adjustYMD = (ymd: [number, number, number]): [number, number, number] => {
  const today = new Date();
  return [
    ymd[0] === 0 ? today.getFullYear() : ymd[0] + (1000 <= ymd[0] ? 0 : 2000),
    ymd[1] === 0 ? today.getMonth() + 1 : ymd[1],
    ymd[2] === 0 ? today.getDate() : ymd[2],
  ];
};

const validateYMD = (ymd: [number, number, number]) => {
  const date = new Date(ymd[0], ymd[1] - 1, ymd[2], 0, 0, 0, 0);
  return date.getMonth() === ymd[1] - 1 && date.getDate() === ymd[2];
};

const toStringYMD = (ymd: [number, number, number], delimiter = "") =>
  `${ymd[0].toString()}${delimiter}${ymd[1].toString().padStart(2, "0")}${delimiter}${ymd[2].toString().padStart(2, "0")}`;

const inputHandler = (e: Event) => {
  const element = e.target as HTMLInputElement;
  element.value = element.value.replace(/\D/g, "");
  currentValue.value = element.value;
};

const focusHandler = (value: boolean) => {
  if (props.readonly || props.disabled) {
    return;
  }
  focus.value = value;
  if (value) {
    return;
  }
  if (editValid.value) {
    showValid.value = true;
    showValue.value = "";
    if (editValue.value) {
      const ymd = adjustYMD(extractYMD(editValue.value));
      showValue.value = toStringYMD(ymd, config.dateDelimiter);
      editValue.value = toStringYMD(ymd);
    }
  } else {
    showValid.value = !required.value;
    showValue.value = "";
    editValue.value = "";
  }
  emits("update:modelValue", showValue.value === "" ? null : showValue.value);
};

// Date Picker

const { primaryLanguage } = useAcceptLanguage();

const menu = ref(false);
const showMenu = computed({
  get: () => menu.value,
  set: (value) => {
    menu.value = value;
    if (value) {
      calendarValue.value = editValid.value ? toStringYMD(adjustYMD(extractYMD(editValue.value))) : "";
    }
  },
});

const calendarValue = ref("");

const selectHandler = (value: string) => {
  calendarValue.value = value;
  showValid.value = true;
  showValue.value = toStringYMD(adjustYMD(extractYMD(value)), config.dateDelimiter);
  editValue.value = value;
  showMenu.value = false;
  focusHandler(false);
};
</script>

<template>
  <v-text-field
    maxlength="8"
    v-bind="$attrs"
    v-show="show"
    :disabled="props.disabled"
    :error-messages="message"
    :readonly="props.readonly"
    :value="currentValue"
    @input="inputHandler"
    @update:focused="focusHandler"
  >
    <template #message="{ message:msg }">
      <span style="padding-left: 1em;">{{ msg }}</span>
    </template>
    <template v-if="!props.disabled && !props.readonly" #append>
      <v-menu v-model="showMenu">
        <template #activator="{ props:activatorProps }">
          <v-btn class="rounded-circle" color="grey" size="small" variant="text" v-bind="activatorProps" :icon="mdiCalendar" />
        </template>
        <datepicker
          auto-apply
          inline
          model-type="yyyyMMdd"
          v-model="calendarValue"
          :action-row="{ showSelect: false, showCancel: false, showNow: false, showPreview: false }"
          :hide-navigation="['time']"
          :locale="primaryLanguage"
          @update:model-value="selectHandler"
        />
      </v-menu>
    </template>
  </v-text-field>
</template>
