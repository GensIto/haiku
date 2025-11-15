import { authClient } from "@/react-app/lib/betterAuth";
import { AuthView } from "@daveyplate/better-auth-ui";
import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/auth/sign-in")({
  component: Signin,
  beforeLoad: async () => {
    const session = await authClient.getSession();
    if (session.data) {
      throw redirect({ to: "/", replace: true });
    }
  },
});

function Signin() {
  return (
    <div className='flex min-h-screen items-center justify-center'>
      <AuthView pathname='sign-in' />
    </div>
  );
}
