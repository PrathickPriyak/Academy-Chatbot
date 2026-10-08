"use client";

import { useState, type FormEvent, type ReactNode } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { site } from "@/data/site";
import { cn } from "@/lib/utils";

type Status = "idle" | "loading" | "success" | "error";

type FieldErrors = Partial<Record<"name" | "email" | "phone" | "subject" | "message", string>>;

function validate(fields: {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}): FieldErrors {
  const errors: FieldErrors = {};
  if (fields.name.length < 2) errors.name = "Please enter your full name.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email)) errors.email = "Please enter a valid email address.";
  if (fields.phone && fields.phone.replace(/\D/g, "").length < 8) {
    errors.phone = "Please enter a valid phone number, or leave this blank.";
  }
  if (fields.subject.length < 3) errors.subject = "Please enter a subject.";
  if (fields.message.length < 10) errors.message = "Please add a bit more detail to your message.";
  return errors;
}

export function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    const form = event.currentTarget;
    const data = new FormData(form);
    const fields = {
      name: String(data.get("name") ?? "").trim(),
      email: String(data.get("email") ?? "").trim(),
      phone: String(data.get("phone") ?? "").trim(),
      subject: String(data.get("subject") ?? "").trim(),
      message: String(data.get("message") ?? "").trim(),
    };

    const nextErrors = validate(fields);
    setFieldErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      setStatus("error");
      setError("Please fix the highlighted fields and try again.");
      return;
    }

    setStatus("loading");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(fields),
      });
      const payload = (await response.json()) as { ok?: boolean; mailto?: string; error?: string };

      if (!response.ok || !payload.mailto) {
        throw new Error(payload.error || "Unable to prepare your message.");
      }

      window.location.href = payload.mailto;
      setStatus("success");
      setFieldErrors({});
      form.reset();
    } catch (err) {
      setStatus("error");
      setError(
        err instanceof Error
          ? err.message
          : `Something went wrong. Please email ${site.email} or call ${site.phone}.`,
      );
    }
  }

  if (status === "success") {
    return (
      <div
        className="border-border bg-card rounded-2xl border p-6 shadow-soft sm:p-8"
        role="status"
        aria-live="polite"
      >
        <p className="text-primary text-sm font-semibold tracking-[0.16em] uppercase">Message ready</p>
        <h2 className="font-display mt-2 text-2xl tracking-tight">Your email client should open next</h2>
        <p className="text-muted-foreground mt-3 text-sm leading-relaxed">
          We drafted your note to {site.email}. If nothing opens, email us directly or call{" "}
          <a href={site.phoneHref} className="text-foreground font-semibold underline-offset-4 hover:underline">
            {site.phone}
          </a>
          .
        </p>
        <Button type="button" className="mt-6" onClick={() => setStatus("idle")}>
          Send another message
        </Button>
      </div>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      className="border-border bg-card space-y-5 rounded-2xl border p-6 shadow-soft sm:p-8"
      noValidate
    >
      <div>
        <h2 className="font-display text-2xl tracking-tight">Send a message</h2>
        <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
          Tell us about courses, enrollment, or partnerships. No API keys are used in the browser — messages open via
          your email client to {site.email}.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field
          id="name"
          label="Name"
          error={fieldErrors.name}
          input={<Input id="name" name="name" autoComplete="name" required aria-invalid={Boolean(fieldErrors.name)} />}
        />
        <Field
          id="email"
          label="Email"
          error={fieldErrors.email}
          input={
            <Input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              aria-invalid={Boolean(fieldErrors.email)}
            />
          }
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field
          id="phone"
          label="Phone"
          error={fieldErrors.phone}
          input={
            <Input
              id="phone"
              name="phone"
              type="tel"
              autoComplete="tel"
              aria-invalid={Boolean(fieldErrors.phone)}
            />
          }
        />
        <Field
          id="subject"
          label="Subject"
          error={fieldErrors.subject}
          input={
            <Input id="subject" name="subject" required aria-invalid={Boolean(fieldErrors.subject)} />
          }
        />
      </div>

      <Field
        id="message"
        label="Message"
        error={fieldErrors.message}
        input={
          <Textarea id="message" name="message" rows={5} required aria-invalid={Boolean(fieldErrors.message)} />
        }
      />

      {error ? (
        <p className="bg-destructive/10 text-destructive rounded-xl px-3 py-2 text-sm" role="alert">
          {error}
        </p>
      ) : null}

      <Button type="submit" disabled={status === "loading"} className="w-full sm:w-auto" size="lg">
        {status === "loading" ? "Preparing message…" : "Send message"}
      </Button>
    </form>
  );
}

function Field({
  id,
  label,
  error,
  input,
}: {
  id: string;
  label: string;
  error?: string;
  input: ReactNode;
}) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-semibold">
        {label}
      </label>
      <div className={cn(error && "[&_input]:border-destructive [&_textarea]:border-destructive")}>{input}</div>
      {error ? (
        <p id={`${id}-error`} className="text-destructive mt-1.5 text-xs" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
