"use client";

import { useState, type FormEvent } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { site } from "@/data/site";

type Status = "idle" | "loading" | "success" | "error";

export function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    const form = event.currentTarget;
    const data = new FormData(form);
    const name = String(data.get("name") ?? "").trim();
    const email = String(data.get("email") ?? "").trim();
    const phone = String(data.get("phone") ?? "").trim();
    const subject = String(data.get("subject") ?? "").trim();
    const message = String(data.get("message") ?? "").trim();

    if (name.length < 2) {
      setError("Please enter your name.");
      setStatus("error");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address.");
      setStatus("error");
      return;
    }
    if (subject.length < 3) {
      setError("Please enter a subject.");
      setStatus("error");
      return;
    }
    if (message.length < 10) {
      setError("Please enter a message with a bit more detail.");
      setStatus("error");
      return;
    }

    setStatus("loading");

    try {
      const body = [
        `Name: ${name}`,
        `Email: ${email}`,
        phone ? `Phone: ${phone}` : null,
        `Subject: ${subject}`,
        "",
        message,
      ]
        .filter(Boolean)
        .join("\n");

      const mailto = `mailto:${site.email}?subject=${encodeURIComponent(`[Academy] ${subject}`)}&body=${encodeURIComponent(body)}`;
      window.location.href = mailto;
      setStatus("success");
      form.reset();
    } catch {
      setStatus("error");
      setError("Something went wrong opening your email client. Please email us directly.");
    }
  }

  return (
    <form onSubmit={onSubmit} className="border-border bg-card space-y-4 rounded-2xl border p-6 shadow-soft" noValidate>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className="mb-1.5 block text-sm font-semibold">
            Name
          </label>
          <Input id="name" name="name" autoComplete="name" required />
        </div>
        <div>
          <label htmlFor="email" className="mb-1.5 block text-sm font-semibold">
            Email
          </label>
          <Input id="email" name="email" type="email" autoComplete="email" required />
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="phone" className="mb-1.5 block text-sm font-semibold">
            Phone
          </label>
          <Input id="phone" name="phone" type="tel" autoComplete="tel" />
        </div>
        <div>
          <label htmlFor="subject" className="mb-1.5 block text-sm font-semibold">
            Subject
          </label>
          <Input id="subject" name="subject" required />
        </div>
      </div>
      <div>
        <label htmlFor="message" className="mb-1.5 block text-sm font-semibold">
          Message
        </label>
        <Textarea id="message" name="message" rows={5} required />
      </div>

      {error ? (
        <p className="text-destructive text-sm" role="alert">
          {error}
        </p>
      ) : null}
      {status === "success" ? (
        <p className="text-success text-sm" role="status">
          Your email client should open with the message drafted. If it doesn’t, write to {site.email}.
        </p>
      ) : null}

      <Button type="submit" disabled={status === "loading"} className="w-full sm:w-auto">
        {status === "loading" ? "Preparing…" : "Send message"}
      </Button>
    </form>
  );
}
