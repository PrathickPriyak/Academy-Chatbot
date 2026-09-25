"use client";

import { useActionState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { ActionState } from "@/lib/courses/actions";

const initial: ActionState = { ok: false, message: "" };

export function InlineForm({
  action,
  fields,
  submitLabel,
  hidden,
}: {
  action: (state: ActionState, formData: FormData) => Promise<ActionState>;
  fields: Array<{ name: string; label: string; type?: string }>;
  submitLabel: string;
  hidden?: Record<string, string>;
}) {
  const [state, formAction, pending] = useActionState(action, initial);

  return (
    <form action={formAction} className="grid gap-2">
      {hidden
        ? Object.entries(hidden).map(([name, value]) => (
            <input key={name} type="hidden" name={name} value={value} />
          ))
        : null}
      {fields.map((field) => (
        <Input
          key={field.name}
          name={field.name}
          type={field.type ?? "text"}
          required
          placeholder={field.label}
          aria-label={field.label}
        />
      ))}
      {state.message ? (
        <p className={state.ok ? "text-success text-xs" : "text-destructive text-xs"}>
          {state.message}
        </p>
      ) : null}
      <Button type="submit" variant="secondary" disabled={pending}>
        {submitLabel}
      </Button>
    </form>
  );
}
