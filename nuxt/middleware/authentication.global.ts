export default defineNuxtRouteMiddleware((to) => {
  /* ログインを強制 */
  const { currentEmployee } = useAuthenticate();
  if (!currentEmployee.value && to.path !== "/") {
    return navigateTo("/");
  }
});
