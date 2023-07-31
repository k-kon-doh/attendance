import { useRouter as useNextRouter, usePathname } from "next/navigation";

import { currentEmployeeState } from "@/composables/authenticate";
import { csrfTokenState } from "@/composables/csrf-token";

/** ルーター */
export function useRouter() {
  const router = useNextRouter();
  const pathname = usePathname();

  const adjust = (href: string) => {
    if (pathname === "/") {
      return href !== "/" && currentEmployeeState.choiceId ? href : "/";
    }
    return href !== "/" && currentEmployeeState.choiceId && csrfTokenState.value ? href : "/";
  };
  return {
    back: router.back,
    replace: (href: string) => router.replace(adjust(href)),
    push: (href: string) => router.push(adjust(href)),
  };
}
