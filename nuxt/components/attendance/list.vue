<!-- 勤怠リスト -->

<script setup lang="ts">
// 機能(feature)が変化する都度、再描画ではなく再作成とする。

import type { Attendance } from "composables/attendance";
import type { Criteria } from "composables/list-condition";

const config = useAppConfig();
const { labels } = useLabel();
const { messages } = useMessage();
const { addFlashMessage } = useFlashMessage();

const { feature } = useFeature();
const items = config.featureListItemsMap[feature.value];

const { criteria, scrollPosition } = useListCondition(feature);

const { find } = useAttendance();
const { data, pending, error, refresh } = await find(criteria, true);
addFlashMessageIfError(error);

const attendances = computed<Attendance[]>(() => (data.value ? data.value : []));

const searchHandler = (value: Criteria) => {
  scrollPosition.value = 0;
  criteria.value = value;
  refresh().then(() => addFlashMessageIfError(error));
};

const dblclickHandler = (id: number) => {
  const attendance = attendances.value.find((it) => it.id === id);
  if (attendance == null) {
    addFlashMessage(`${messages.value.noAttendance}(id: ${id})`, "error");
    return;
  }
  let action = ""; // show
  switch (feature.value) {
    case config.features.selfApply:
    case config.features.representativeApply:
      if (attendance.status === config.status.making) {
        action = "/edit";
      }
      break;
    case config.features.approve:
      if (attendance.status === config.status.applying) {
        action = "/approve";
      }
      break;
  }
  navigateTo(`/attendances/${id}${action}`);
};

const scrollHandler = (value: number) => (scrollPosition.value = value);
</script>

<template>
  <v-container class="v-layout--full-height">
    <attendance-criteria :criteria="criteria" :pending="pending" @search="searchHandler" />
    <attendance-base-list
      v-memo="[pending, attendances]"
      :scroll-position="scrollPosition"
      :pending="pending"
      :attendances="attendances"
      @dblclick="dblclickHandler"
      @scroll="scrollHandler"
    >
      <template #head>
        <th class="bg-secondary" v-for="item in items" :key="item">
          {{ labels.long[item] }}
        </th>
      </template>
      <template #body="{ attendance }">
        <td v-for="item in items" :key="item">
          <v-chip v-if="item === 'status'" :color="attendance['statusColor']">{{ attendance[item] }}</v-chip>
          <span v-else>{{ attendance[item] }}</span>
        </td>
      </template>

      <template #empty>
        <td class="text-center" :colspan="items.length">
          {{ messages.noAttendance }}
        </td>
      </template>
    </attendance-base-list>
  </v-container>
</template>
