"use client";

import { motion } from "framer-motion";

export function LoadingScreen() {
  return (
    <div className="bg-background text-foreground relative flex min-h-screen items-center justify-center overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgb(14_107_100_/_0.16),_transparent_42%)] dark:bg-[radial-gradient(circle_at_top,_rgb(61_207_194_/_0.14),_transparent_42%)]" />
      <motion.div
        className="relative flex flex-col items-center px-6 text-center"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <motion.div
          className="bg-primary text-primary-foreground mb-6 flex size-16 items-center justify-center rounded-2xl shadow-lg"
          animate={{ scale: [1, 1.04, 1] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
        >
          <span className="font-display text-2xl font-semibold tracking-tight">IZ</span>
        </motion.div>
        <p className="font-display text-3xl tracking-tight sm:text-4xl">Infozub</p>
        <p className="text-muted-foreground mt-2 text-sm font-medium tracking-[0.22em] uppercase">
          Digital Academy
        </p>
        <div className="bg-muted mt-8 h-1 w-40 overflow-hidden rounded-full">
          <motion.div
            className="bg-accent h-full w-1/2 rounded-full"
            animate={{ x: ["-100%", "220%"] }}
            transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>
        <p className="text-muted-foreground mt-4 text-sm">Preparing your academy</p>
      </motion.div>
    </div>
  );
}
