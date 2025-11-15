import { createFileRoute, redirect } from "@tanstack/react-router";
import { authClient } from "@/react-app/lib/betterAuth";
import { client } from "@/react-app/lib/hono";
import { queryClient } from "@/react-app/lib/query";
import { Avatar, AvatarFallback } from "@/react-app/components/ui/avatar";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/react-app/components/ui/card";
import { Skeleton } from "@/react-app/components/ui/skeleton";
import { Suspense } from "react";
import { UserVerses } from "@/react-app/features/account/UserVerses/UserVerses";

export const Route = createFileRoute("/account/")({
  component: Account,
  beforeLoad: async () => {
    const session = await authClient.getSession();
    if (!session.data) {
      throw redirect({ to: "/auth/sign-in", replace: true });
    }
  },
  loader: async () => {
    const res = await queryClient.ensureQueryData({
      queryKey: ["account"],
      queryFn: async () => {
        const session = await authClient.getSession();
        if (!session.data?.user?.id) throw new Error("User not found");

        const res = await client.api.users.me.$get();
        if (!res.ok) throw new Error(`Failed: ${res.status}`);
        const data = await res.json();
        return data.user;
      },
      staleTime: 1000 * 60 * 5,
    });

    return { user: res };
  },
});

function Account() {
  const { user } = Route.useLoaderData();
  console.log(user);
  return (
    <main className='min-h-screen bg-background max-w-[864px] mx-auto p-8 space-y-8'>
      <Card>
        <CardHeader>
          <Avatar className='size-10'>
            <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
          </Avatar>
        </CardHeader>
        <CardContent>
          <h1 className='text-2xl font-bold'>{user.name}</h1>
        </CardContent>
        <CardFooter>
          <p className='text-sm text-muted-foreground w-full'>{user.email}</p>
        </CardFooter>
      </Card>
      {/* Recent Poems Section */}
      <div>
        <div className='flex items-center justify-between mb-6'>
          <h2 className='text-base font-medium text-emerald-100'>あなたの詠</h2>
        </div>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
          <Suspense fallback={<Skeleton className='col-span-full h-64' />}>
            <UserVerses />
          </Suspense>
        </div>
      </div>
    </main>
  );
}
