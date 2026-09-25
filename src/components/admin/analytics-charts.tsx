import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { DailyCount, RankedItem } from "@/lib/analytics/report";

function BarChart({
  items,
  empty,
}: {
  items: Array<{ label: string; count: number }>;
  empty: string;
}) {
  const peak = Math.max(1, ...items.map((item) => item.count));
  if (items.length === 0 || items.every((item) => item.count === 0)) {
    return <p className="text-muted-foreground text-sm">{empty}</p>;
  }

  return (
    <div className="grid gap-3">
      {items.map((item) => (
        <div key={item.label} className="grid gap-1">
          <div className="flex items-center justify-between gap-3 text-sm">
            <span className="truncate">{item.label}</span>
            <span className="text-muted-foreground tabular-nums">{item.count}</span>
          </div>
          <div className="bg-muted h-2 overflow-hidden rounded-full">
            <div
              className="bg-primary h-full rounded-full"
              style={{ width: `${Math.max(6, Math.round((item.count / peak) * 100))}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

export function AnalyticsCharts({
  questionsByDay,
  mostAsked,
  mostDiscussed,
  outcomes,
}: {
  questionsByDay: DailyCount[];
  mostAsked: RankedItem[];
  mostDiscussed: RankedItem[];
  outcomes: RankedItem[];
}) {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Questions this week</CardTitle>
          <CardDescription>Anonymous question counts by day.</CardDescription>
        </CardHeader>
        <CardContent>
          <BarChart items={questionsByDay} empty="No questions recorded this week." />
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Answer outcomes</CardTitle>
          <CardDescription>Generated answers, fallbacks, and contact clicks.</CardDescription>
        </CardHeader>
        <CardContent>
          <BarChart items={outcomes} empty="No answer outcomes yet." />
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Most asked questions</CardTitle>
          <CardDescription>Emails and phone numbers are removed before storage.</CardDescription>
        </CardHeader>
        <CardContent>
          <BarChart items={mostAsked} empty="No questions recorded yet." />
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Most discussed courses</CardTitle>
          <CardDescription>Courses cited when an answer is generated.</CardDescription>
        </CardHeader>
        <CardContent>
          <BarChart items={mostDiscussed} empty="No course discussions yet." />
        </CardContent>
      </Card>
    </div>
  );
}
