<!-- 新規作成浮動ボタン -->

<script setup lang="ts">
import { mdiPlus } from "@mdi/js";

interface Emits {
  (e: "click"): void;
}
const emits = defineEmits<Emits>();
</script>

<template>
  <v-layout-item class="pr-4 text-end" model-value position="bottom" size="60">
    <v-btn active class="rounded-circle bg-secondary" color="surface" size="large" :icon="mdiPlus" @click="emits('click')" />
  </v-layout-item>
</template>
