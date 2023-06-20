<!-- フラッシュメッセージ -->

<script setup lang="ts">
const { messages, removeFlashMessage } = useFlashMessage();

const show = computed(() => !!messages.value.length);

const removeHandler = (id: number) => removeFlashMessage(id);
</script>

<template>
  <v-snackbar color="on-surface" multi-line timeout="-1" v-model="show" :close-on-back="false">
    <flash-message-detail v-for="message in messages" :message="message" :key="message.id" @remove="removeHandler" />
  </v-snackbar>
</template>
