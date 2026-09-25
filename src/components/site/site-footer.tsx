import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="border-border border-t">
      <div className="text-muted-foreground mx-auto flex w-full max-w-6xl flex-col gap-3 px-4 py-8 text-sm sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <p>Infozub AI Assistant. Answers stay inside academy course knowledge.</p>
        <div className="flex gap-4">
          <Link href="/courses" className="hover:text-foreground">
            Courses
          </Link>
          <Link href="/contact" className="hover:text-foreground">
            Contact
          </Link>
        </div>
      </div>
    </footer>
  );
}
