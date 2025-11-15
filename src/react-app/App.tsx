import { QueryClientProvider } from "@tanstack/react-query";
import { router } from "@/react-app/lib/router";
import { RouterProvider } from "@tanstack/react-router";
import { queryClient } from "@/react-app/lib/query";
import { Toaster } from "sonner";
import { authClient } from "@/react-app/lib/betterAuth";
import { AuthUIProvider } from "@daveyplate/better-auth-ui";
import { Link } from "@tanstack/react-router";

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthUIProvider
        authClient={authClient}
        navigate={(href) => router.navigate({ to: href })}
        Link={({ href, className, children }) => (
          <Link to={href} className={className}>
            {children}
          </Link>
        )}
      >
        <RouterProvider router={router} />
        <Toaster />
      </AuthUIProvider>
    </QueryClientProvider>
  );
}
