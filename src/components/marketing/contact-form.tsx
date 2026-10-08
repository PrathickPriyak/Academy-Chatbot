"use client";

import { useId, useRef, useState, type FormEvent, type ReactElement } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { site } from "@/data/site";
import { cn } from "@/lib/utils";

type Status = "idle" | "loading" | "success" | "error";

type FieldKey = "name" | "email" | "phone" | "subject" | "message";
type FieldErrors = Partial<Record<FieldKey, string>>;

function validate(fields: Record<FieldKey, string>): FieldErrors {
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
  const formId = useId();
  const formRef = useRef<HTMLFormElement>(null);
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
      const order: FieldKey[] = ["name", "email", "phone", "subject", "message"];
      const firstInvalid = order.find((key) => nextErrors[key]);
      if (firstInvalid) {
        window.requestAnimationFrame(() => {
          form.querySelector<HTMLElement>(`#${formId}-${firstInvalid}`)?.focus();
        });
      }
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
        className="bg-card rounded-[1.5rem] p-6 shadow-[0_1px_2px_rgb(11_31_42/0.04),0_12px_32px_rgb(11_31_42/0.06)] ring-1 ring-border/80 sm:p-8"
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
      ref={formRef}
      onSubmit={onSubmit}
      className="bg-card space-y-5 rounded-[1.5rem] p-6 shadow-[0_1px_2px_rgb(11_31_42/0.04),0_12px_32px_rgb(11_31_42/0.06)] ring-1 ring-border/80 sm:p-8"
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
          id={`${formId}-name`}
          label="Name"
          error={fieldErrors.name}
          control={
            <Input
              id={`${formId}-name`}
              name="name"
              autoComplete="name"
              required
              aria-invalid={Boolean(fieldErrors.name)}
              aria-describedby={fieldErrors.name ? `${formId}-name-error` : undefined}
            />
          }
        />
        <Field
          id={`${formId}-email`}
          label="Email"
          error={fieldErrors.email}
          control={
            <Input
              id={`${formId}-email`}
              name="email"
              type="email"
              autoComplete="email"
              required
              aria-invalid={Boolean(fieldErrors.email)}
              aria-describedby={fieldErrors.email ? `${formId}-email-error` : undefined}
            />
          }
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field
          id={`${formId}-phone`}
          label="Phone"
          optional
          error={fieldErrors.phone}
          control={
            <Input
              id={`${formId}-phone`}
              name="phone"
              type="tel"
              autoComplete="tel"
              aria-invalid={Boolean(fieldErrors.phone)}
              aria-describedby={fieldErrors.phone ? `${formId}-phone-error` : undefined}
            />
          }
        />
        <Field
          id={`${formId}-subject`}
          label="Subject"
          error={fieldErrors.subject}
          control={
            <Input
              id={`${formId}-subject`}
              name="subject"
              required
              aria-invalid={Boolean(fieldErrors.subject)}
              aria-describedby={fieldErrors.subject ? `${formId}-subject-error` : undefined}
            />
          }
        />
      </div>

      <Field
        id={`${formId}-message`}
        label="Message"
        error={fieldErrors.message}
        control={
          <Textarea
            id={`${formId}-message`}
            name="message"
            rows={5}
            required
            aria-invalid={Boolean(fieldErrors.message)}
            aria-describedby={fieldErrors.message ? `${formId}-message-error` : undefined}
          />
        }
      />

      {error ? (
        <p id={`${formId}-form-error`} className="bg-destructive/10 text-destructive rounded-xl px-3 py-2 text-sm" role="alert">
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
  optional,
  control,
}: {
  id: string;
  label: string;
  error?: string;
  optional?: boolean;
  control: ReactElement;
}) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-semibold">
        {label}
        {optional ? <span className="text-muted-foreground font-medium"> (optional)</span> : null}
      </label>
      <div className={cn(error && "[&_input]:border-destructive [&_textarea]:border-destructive")}>{control}</div>
      {error ? (
        <p id={`${id}-error`} className="text-destructive mt-1.5 text-xs" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
