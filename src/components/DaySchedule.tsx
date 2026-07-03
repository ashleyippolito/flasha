import Link from "next/link";
import { Session } from "@/data/sessions";
import { formatTimeRange } from "@/lib/time";
import SessionCard from "./SessionCard";

function groupByTimeBlock(sessions: Session[]) {
  const sorted = [...sessions].sort((a, b) => {
    if (!a.startTime) return 1;
    if (!b.startTime) return -1;
    return a.startTime.localeCompare(b.startTime);
  });

  const blocks: { key: string; start: string | null; end: string | null; sessions: Session[] }[] = [];
  for (const session of sorted) {
    const key = `${session.startTime ?? "tbd"}-${session.endTime ?? "tbd"}`;
    const existing = blocks.find((b) => b.key === key);
    if (existing) {
      existing.sessions.push(session);
    } else {
      blocks.push({ key, start: session.startTime, end: session.endTime, sessions: [session] });
    }
  }
  return blocks;
}

export default function DaySchedule({ sessions }: { sessions: Session[] }) {
  const blocks = groupByTimeBlock(sessions);

  return (
    <div className="space-y-6">
      {blocks.map((block) => {
        const allPosters = block.sessions.every((s) => s.type === "poster");
        return (
          <div key={block.key}>
            <div className="text-xs font-semibold uppercase tracking-wide text-slate-400 mb-2">
              {formatTimeRange(block.start, block.end)}
            </div>
            {allPosters ? (
              <Link
                href="/posters"
                className="flex items-center justify-between rounded-xl border border-dashed border-flasha-sky/50 bg-flasha-sky/5 p-4 hover:bg-flasha-sky/10 transition"
              >
                <div>
                  <p className="text-sm font-medium text-slate-900">{block.sessions.length} Poster Sessions</p>
                  <p className="text-xs text-slate-500">Foyer · browse them all in the Posters tab</p>
                </div>
                <span className="text-sm font-medium text-flasha-teal-dark whitespace-nowrap">View All →</span>
              </Link>
            ) : (
              <div className="grid gap-3 sm:grid-cols-2">
                {block.sessions.map((session) => (
                  <SessionCard key={session.id} session={session} />
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
