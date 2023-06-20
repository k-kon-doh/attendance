<!-- 勤怠情報：ログイン -->

<script setup lang="ts">
const { clean } = useCleaner();
clean();

const { labels } = useLabel();
const { messages } = useMessage();
const { currentEmployee, login } = useAuthenticate();
const { pending } = login();

const id = ref("");
const password = ref("");

const validForm = ref(false);
const validateId = (value: string) => !!value || messages.value.plsInputLoginId!;
const validatePassword = (value: string) => !!value || messages.value.plsInputPassword!;

const loginHandler = () => {
  if (!validForm.value) {
    return;
  }
  login(id.value, password.value).then(({ error }) => {
    addFlashMessageIfError(error);
    if (!error.value && currentEmployee.value) {
      navigateTo("/attendances");
    }
  });
};
</script>

<template>
  <v-card class="mt-5 mx-auto px-6 pt-8 pb-12 rounded-xl" elevation="24" max-width="500px" :loading="pending">
    <template #loader="{ isActive }">
      <v-progress-linear color="primary" height="10" indeterminate :active="isActive" />
    </template>
    <v-form class="justify-space-between" v-model="validForm" @submit.prevent="loginHandler">
      <v-defaults-provider :defaults="{ VTextField: { class: 'mb-6', variant: 'outlined' } }">
        <v-text-field
          maxlength="32"
          v-model="id"
          :label="labels.long.loginId"
          :placeholder="messages.plsInputLoginId"
          :readonly="pending"
          :rules="[validateId]"
        />
        <v-text-field
          maxlength="32"
          type="password"
          v-model="password"
          :label="labels.long.password"
          :placeholder="messages.plsInputPassword"
          :readonly="pending"
          :rules="[validatePassword]"
        />
      </v-defaults-provider>
      <v-btn block class="mt-8" size="x-large" type="submit" :disabled="pending">{{ labels.long.login }}</v-btn>
    </v-form>
  </v-card>
</template>
