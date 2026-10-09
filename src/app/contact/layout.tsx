import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact",
  description: "Contact Infozub Digital Academy about courses and enrollment.",
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children;
}
