<!-- 時間テキストボックス -->

<script setup lang="ts">
defineOptions({
  inheritAttrs: false,
});

interface Props {
  modelValue: string;
  necessary: string;
  readonly?: boolean | undefined;
  disabled?: boolean | undefined;
  errorMessage?: string | undefined;
}
const props = defineProps<Props>();

interface Emits {
  (e: "update:modelValue", value: string): void;
}
const emits = defineEmits<Emits>();

const config = useAppConfig();
const { labels } = useLabel();

const maxHour = Number(config.maxTime.hour) || 0;
const maxMinute = Number(config.maxTime.minute) || 0;
const invalidPattern = new RegExp(String.raw`[^${config.timeDelimiter}\d\s]`);

const show = computed(() => props.necessary !== config.necessary.notNeeded);
const required = computed(() => props.necessary === config.necessary.required);
const message = computed(() => {
  let value = "";
  if (currentValid.value) {
    value = props.errorMessage ? `${config.errorMark}${props.errorMessage}` : "";
  } else {
    const timeNote = `00${config.timeDelimiter}00～${config.maxTime.hour}${config.timeDelimiter}${config.maxTime.minute}`;
    value = required.value ? `${config.errorMark}${labels.value.long.required} ${timeNote}` : timeNote;
  }
  return value;
});

const focus = ref(false);
const editing = computed(() => !props.readonly && !props.disabled && show.value && focus.value);

const showValid = ref(false);
const showValue = ref("");

const editValid = computed(() => (!required.value && !editValue.value) || (!!editValue.value && validateHM(extractHM(editValue.value))));
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
      const normalizedValue = propsValue.modelValue.trim();
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
      const elements = normalizedValue.replace(/\s/g, "").split(config.timeDelimiter).reverse();
      if (2 < elements.length) {
        return;
      }
      const hm = extractHM(elements);
      if (!validateHM(hm)) {
        return;
      }
      showValid.value = true;
      editValue.value = toStringHM(hm);
    },
    {
      immediate: true,
      deep: false,
    }
  );
  onScopeDispose(stop);
});

const extractHM = (value: string | string[]): [number, number] => {
  const aValue = typeof value === "string" ? value : value.length === 1 ? value[0] : null;
  return aValue ? [Number(aValue.slice(0, -2)) || 0, Number(aValue.slice(-2)) || 0] : [Number(value[1]) || 0, Number(value[0]) || 0];
};

const validateHM = (hm: [number, number]) => 0 <= hm[0] && hm[0] <= maxHour && 0 <= hm[1] && hm[1] <= maxMinute;

const toStringHM = (hm: [number, number], delimiter = "") => `${hm[0].toString().padStart(2, "0")}${delimiter}${hm[1].toString().padStart(2, "0")}`;

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
      const hm = extractHM(editValue.value);
      showValue.value = toStringHM(hm, config.timeDelimiter);
      editValue.value = toStringHM(hm);
    }
  } else {
    showValid.value = !required.value;
    showValue.value = "";
    editValue.value = "";
  }
  emits("update:modelValue", showValue.value);
};
</script>

<template>
  <v-text-field
    maxlength="4"
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
  </v-text-field>
</template>
