import { Suspense } from "react";

import "./globals.css";

import Contents from "@/app/contents";
import Loading from "@/app/loading";
import { Initialize } from "@/components/initialize-server";
import ThemeRegistry from "@/components/theme-registry";

export const metadata = {
  title: "Attendance",
  description: "Attendance System",
};

/** グローバルレイアウト */
export default async function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body>
        <ThemeRegistry>
          <Suspense fallback={<Loading />}>
            <Initialize>
              <Contents>{children}</Contents>
            </Initialize>
          </Suspense>
        </ThemeRegistry>
      </body>
    </html>
  );
}
