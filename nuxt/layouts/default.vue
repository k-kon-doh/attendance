<!-- 基本レイアウト -->

<script setup lang="ts">
import { useTheme } from "vuetify/lib/framework.mjs";

const theme = useTheme();
const { labels } = useLabel();
const { currentEmployee } = useAuthenticate();

const showDrawer = ref(false);

const authenticated = computed(() => currentEmployee.value != null);
const employeeName = computed(() => `${currentEmployee.value?.organizationName} : ${currentEmployee.value?.name}`);

const { beforeEach, afterEach } = useRouter();
const transition = ref(false);
beforeEach(() => (transition.value = true));
afterEach(() => (transition.value = false));
</script>

<template>
  <v-app>
    <v-toolbar app color="primary" density="compact">
      <template #prepend>
        <v-app-bar-nav-icon color="surface" @click.stop="showDrawer = !showDrawer" />
      </template>
      <v-toolbar-title class="text-surface">{{ labels.long.title }}</v-toolbar-title>
      <template #append>
        <v-toolbar-items v-show="authenticated" variant="plain">
          <v-label class="text-surface">{{ employeeName }}</v-label>
          <v-btn color="surface" nuxt to="/">{{ labels.long.logout }}</v-btn>
        </v-toolbar-items>
      </template>
    </v-toolbar>

    <v-main v-if="!transition">
      <v-container class="v-layout--full-height">
        <slot></slot>
      </v-container>
    </v-main>

    <v-footer app class="footer flex-row-reverse bg-primary" style="width: 100%;">k-kon-doh</v-footer>

    <v-navigation-drawer app class="pa-2" v-model="showDrawer">
      <v-switch false-value="light" label="Theme" true-value="dark" v-model="theme.global.name" />
      <p>※ 以下割愛</p>
    </v-navigation-drawer>

    <flash-message />
  </v-app>
</template>
