import { createFileRoute, redirect } from "@tanstack/react-router";
import { authClient } from "@/react-app/lib/betterAuth";
import { FreeVerse } from "@/react-app/features/home/FreeVerse/FreeVerse";
import { RecentVerses } from "@/react-app/features/home/RecentVerses/RecentVerses";
import { Suspense } from "react";
import { Skeleton } from "@/react-app/components/ui/skeleton";
import { DailyTheme } from "@/react-app/features/home/DailyTheme/DailyTheme";

export const Route = createFileRoute("/")({
  component: Index,
  beforeLoad: async () => {
    const session = await authClient.getSession();
    if (!session.data) {
      throw redirect({ to: "/auth/sign-in", replace: true });
    }
  },
});

function Index() {
  return (
    <main className='min-h-screen bg-background max-w-[864px] mx-auto p-8 space-y-8'>
      <h1 className='text-base leading-6 text-center text-emerald-200/70'>
        心に浮かぶ言葉を、詩にして共有しよう
      </h1>
      <Suspense
        fallback={
          <Skeleton
            className='col-span-full h-64'
            children={
              <div className='flex items-center justify-center h-full'>
                <p>今日の庭を見ています...</p>
              </div>
            }
          />
        }
      >
        <DailyTheme />
      </Suspense>
      <FreeVerse />
      {/* Recent Poems Section */}
      <div>
        <div className='flex items-center justify-between mb-6'>
          <h2 className='text-base font-medium text-emerald-100'>
            最近謳われた詩
          </h2>
          <span className='text-sm text-emerald-400/60'>3件</span>
        </div>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
          <Suspense fallback={<Skeleton className='col-span-full h-64' />}>
            <RecentVerses />
          </Suspense>
        </div>
      </div>
    </main>
  );
}
