"use client";

import { addFlashMessage } from "@/composables/flash-message";
import { useRouter } from "@/composables/router";

/** エラーページ */
export default function Error({ error }: { error: Error; reset: () => void }) {
  addFlashMessage(error.message, "error");
  const router = useRouter();
  router.replace("/");
  return null;
}
