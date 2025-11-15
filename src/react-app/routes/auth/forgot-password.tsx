import { authClient } from "@/react-app/lib/betterAuth";
import { AuthView } from "@daveyplate/better-auth-ui";
import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/auth/forgot-password")({
  component: RouteComponent,
  beforeLoad: async () => {
    const session = await authClient.getSession();
    if (session.data) {
      throw redirect({ to: "/", replace: true });
    }
  },
});

function RouteComponent() {
  return (
    <div className='flex min-h-screen items-center justify-center'>
      <AuthView pathname='forgot-password' />
    </div>
  );
}
