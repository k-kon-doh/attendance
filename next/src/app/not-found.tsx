"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

export default function NotFound() {
  const router = useRouter();
  const pathname = usePathname();
  useEffect(() => {
    console.log(`page not found: ${pathname}`);
    router.replace("/");
  }, [pathname, router]);

  return null;
}
