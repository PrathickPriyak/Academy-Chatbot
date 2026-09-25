"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

import { BrandLogo } from "@/components/site/brand-logo";

export function ChatPreview({ titles }: { titles: string[] }) {
  const script = [
    { role: "user" as const, text: "What courses are available?" },
    {
      role: "assistant" as const,
      text: titles.length > 0 ? titles.join(", ") : "Published courses will appear here.",
    },
    { role: "user" as const, text: "Where do these answers come from?" },
    {
      role: "assistant" as const,
      text: "From the Infozub course catalog stored in the database.",
    },
  ];
  const [count, setCount] = useState(1);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setCount((value) => (value >= script.length ? 1 : value + 1));
    }, 1800);
    return () => window.clearInterval(timer);
  }, [script.length]);

  const visible = script.slice(0, count);

  return (
    <div className="border-border bg-card rounded-2xl border p-4 shadow-lg">
      <div className="mb-4 flex items-center justify-between">
        <BrandLogo className="h-7" />
        <span className="bg-success/15 text-success rounded-full px-2 py-0.5 text-xs font-semibold">
          Knowledge only
        </span>
      </div>
      <div className="flex min-h-72 flex-col gap-3">
        {visible.map((message) => (
          <motion.div
            key={message.text}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className={
              message.role === "user"
                ? "bg-primary text-primary-foreground ml-auto max-w-[85%] rounded-2xl rounded-br-md px-3 py-2 text-sm"
                : "bg-muted mr-auto max-w-[85%] rounded-2xl rounded-bl-md px-3 py-2 text-sm"
            }
          >
            {message.text}
          </motion.div>
        ))}
      </div>
      <div className="border-border bg-background text-muted-foreground mt-4 rounded-xl border px-3 py-2 text-sm">
        Ask about Infozub courses...
      </div>
    </div>
  );
}
