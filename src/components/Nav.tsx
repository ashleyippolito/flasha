"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Nav() {
  const pathname = usePathname();

  const linkClass = (href: string) => {
    const active = pathname === href;
    return `text-sm font-medium px-3 py-1.5 rounded-lg transition whitespace-nowrap ${
      active ? "bg-flasha-teal text-white" : "text-slate-600 hover:bg-slate-100"
    }`;
  };

  return (
    <header className="sticky top-0 z-10 bg-white/90 backdrop-blur border-b border-slate-200">
      <div
        className="h-1"
        style={{ background: "linear-gradient(90deg, var(--flasha-gold), var(--flasha-orange), var(--flasha-coral), var(--flasha-teal))" }}
      />
      <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
        <span className="font-semibold text-flasha-teal-dark">
          FLASHA <span className="text-flasha-orange">2026</span>
        </span>
        <nav className="flex gap-1 overflow-x-auto">
          <Link href="/" className={linkClass("/")}>
            Full Schedule
          </Link>
          <Link href="/my-schedule" className={linkClass("/my-schedule")}>
            My Schedule
          </Link>
          <Link href="/posters" className={linkClass("/posters")}>
            Posters
          </Link>
          <Link href="/speakers" className={linkClass("/speakers")}>
            Speakers
          </Link>
        </nav>
      </div>
    </header>
  );
}
