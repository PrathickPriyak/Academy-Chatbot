import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { loginAction } from "@/lib/admin-actions";
import { demoAdmin } from "@/lib/admin-session";

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const params = await searchParams;

  return (
    <main className="flex min-h-screen items-center justify-center px-4">
      <Card variant="elevated" className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Admin login</CardTitle>
          <CardDescription>Preview access for course management.</CardDescription>
        </CardHeader>
        <CardContent>
          <form action={loginAction} className="grid gap-3">
            <Input
              name="email"
              type="email"
              required
              placeholder="Email"
              aria-label="Email"
            />
            <Input
              name="password"
              type="password"
              required
              placeholder="Password"
              aria-label="Password"
            />
            {params.error ? (
              <p className="text-destructive text-sm">
                Those credentials were not accepted.
              </p>
            ) : null}
            <Button type="submit">Sign in</Button>
          </form>
          <p className="text-muted-foreground mt-4 text-xs">
            Preview: {demoAdmin.email} / {demoAdmin.password}
          </p>
        </CardContent>
      </Card>
    </main>
  );
}
