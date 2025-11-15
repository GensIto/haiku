import { Button } from "@/react-app/components/ui/button";
import { authClient } from "@/react-app/lib/betterAuth";
import { createRootRoute, Link, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { User } from "lucide-react";

const RootLayout = () => {
  const { data: session } = authClient.useSession();

  return (
    <>
      <div className='p-2 flex gap-2'>
        {session?.user && (
          <div className='flex items-center justify-between w-full'>
            <Link to='/' className='[&.active]:font-bold'>
              <div className='flex items-center gap-2'>
                <span className='text-4xl leading-10'>🍵</span>
                <h1 className='text-base leading-6 text-foreground'>詠の庭</h1>
              </div>
            </Link>
            <Link to='/account' className='[&.active]:font-bold'>
              <Button
                variant='secondary'
                size='icon'
                className='w-9 h-9 rounded-lg text-emerald-100 hover:bg-emerald-800/10'
              >
                <User className='w-4 h-4' />
              </Button>
            </Link>
          </div>
        )}
      </div>
      <hr />
      <Outlet />
      <TanStackRouterDevtools />
    </>
  );
};

export const Route = createRootRoute({ component: RootLayout });
