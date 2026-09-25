import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { ThemeToggle } from "@/components/providers/theme-toggle";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";

const foundations = [
  {
    title: "Design system",
    description:
      "Shared color, type, spacing, shadow, and radius tokens for every later screen.",
  },
  {
    title: "Reusable UI",
    description:
      "Button, card, badge, input, section, and container primitives with variants.",
  },
  {
    title: "PostgreSQL ready",
    description:
      "Prisma is configured for Postgres. Domain models stay out of this phase.",
  },
];

export default function HomePage() {
  return (
    <main>
      <header className="border-border border-b">
        <Container className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="bg-primary font-display text-primary-foreground flex size-9 items-center justify-center rounded-lg text-sm font-semibold">
              IZ
            </span>
            <span className="font-display text-lg tracking-tight">Infozub</span>
          </div>
          <ThemeToggle />
        </Container>
      </header>

      <Section spacing="lg">
        <Container size="md" className="text-center">
          <Badge variant="accent">Phase 1 foundation</Badge>
          <h1 className="font-display mt-6 text-4xl tracking-tight text-balance sm:text-6xl">
            Infozub Digital Academy
          </h1>
          <p className="text-muted-foreground mx-auto mt-5 max-w-2xl text-base sm:text-lg">
            A production-ready starting point: typed design tokens, themed components,
            dark mode, and a PostgreSQL-ready data layer.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button size="lg">Explore the system</Button>
            <Button size="lg" variant="outline">
              View components
            </Button>
          </div>
        </Container>
      </Section>

      <Section spacing="md" className="pt-0">
        <Container>
          <div className="grid gap-4 md:grid-cols-3">
            {foundations.map((item) => (
              <Card key={item.title} variant="elevated">
                <CardHeader>
                  <CardTitle>{item.title}</CardTitle>
                  <CardDescription>{item.description}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </Container>
      </Section>

      <Section spacing="md" className="border-border border-t">
        <Container>
          <div className="grid gap-6 lg:grid-cols-2">
            <Card variant="outline">
              <CardHeader>
                <CardTitle>Controls</CardTitle>
                <CardDescription>
                  Button, badge, and input variants from the design system.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-4">
                <div className="flex flex-wrap gap-2">
                  <Button>Primary</Button>
                  <Button variant="secondary">Secondary</Button>
                  <Button variant="accent">Accent</Button>
                  <Button variant="ghost">Ghost</Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Badge>Default</Badge>
                  <Badge variant="secondary">Secondary</Badge>
                  <Badge variant="success">Ready</Badge>
                  <Badge variant="outline">Outline</Badge>
                </div>
                <Input placeholder="Search the academy" aria-label="Search the academy" />
                <Input
                  variant="filled"
                  placeholder="Filled input"
                  aria-label="Filled input"
                />
              </CardContent>
            </Card>
            <Card variant="glass">
              <CardHeader>
                <CardTitle>Theme</CardTitle>
                <CardDescription>
                  Light and dark palettes share one token set. Use the toggle in the
                  header to switch.
                </CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {[
                  ["bg-primary", "Primary"],
                  ["bg-accent", "Accent"],
                  ["bg-secondary", "Secondary"],
                  ["bg-muted", "Muted"],
                ].map(([swatch, label]) => (
                  <div key={label} className="space-y-2">
                    <div className={`border-border h-14 rounded-xl border ${swatch}`} />
                    <p className="text-muted-foreground text-xs font-medium">{label}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </Container>
      </Section>
    </main>
  );
}
