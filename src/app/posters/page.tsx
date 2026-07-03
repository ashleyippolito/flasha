"use client";

import { DAYS, SESSIONS } from "@/data/sessions";
import SessionCard from "@/components/SessionCard";
import { formatTimeRange } from "@/lib/time";

export default function PostersPage() {
  const posters = SESSIONS.filter((s) => s.type === "poster");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-slate-900">Poster Sessions</h1>
        <p className="text-sm text-slate-500 mt-1">
          All poster presentations, shown together by day. These run concurrently in the Foyer during the lunch break.
        </p>
      </div>

      {DAYS.map((day) => {
        const dayPosters = posters.filter((s) => s.day === day.key);
        if (dayPosters.length === 0) return null;
        const sorted = [...dayPosters].sort((a, b) => a.title.localeCompare(b.title));
        return (
          <div key={day.key} className="space-y-3">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-flasha-orange">
              {day.label} · {formatTimeRange(dayPosters[0].startTime, dayPosters[0].endTime)} · Foyer
            </h2>
            <div className="grid gap-3 sm:grid-cols-2">
              {sorted.map((session) => (
                <SessionCard key={session.id} session={session} />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
