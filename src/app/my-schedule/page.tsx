"use client";

import Link from "next/link";
import { DAYS, SESSIONS } from "@/data/sessions";
import SessionCard from "@/components/SessionCard";
import { useMySchedule } from "@/lib/useMySchedule";
import { downloadScheduleICS } from "@/lib/ics";

export default function MySchedulePage() {
  const { selectedIds, hydrated } = useMySchedule();

  if (!hydrated) return null;

  const selectedSessions = SESSIONS.filter((s) => selectedIds.includes(s.id));

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-xl font-semibold text-slate-900">My Schedule</h1>
          <p className="text-sm text-slate-500 mt-1">
            Sessions you&apos;ve added, saved in this browser only.
          </p>
        </div>
        {selectedSessions.length > 0 && (
          <div className="text-right">
            <button
              onClick={() => downloadScheduleICS(selectedSessions)}
              className="text-sm font-medium px-4 py-2 rounded-lg bg-flasha-teal text-white hover:bg-flasha-teal-dark transition"
            >
              Download All to Calendar (.ics)
            </button>
            <p className="text-xs text-slate-400 mt-1">
              Import the .ics file into Google Calendar for your whole schedule at once, or use the
              &ldquo;Google Calendar&rdquo; link on each session below to add them one at a time.
            </p>
          </div>
        )}
      </div>

      {selectedSessions.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-300 p-8 text-center text-sm text-slate-500">
          You haven&apos;t added any sessions yet. Head to the{" "}
          <Link href="/" className="text-flasha-teal-dark font-medium hover:underline">
            Full Schedule
          </Link>{" "}
          and tap &ldquo;Add to My Schedule&rdquo; on the sessions you want to attend.
        </div>
      ) : (
        DAYS.map((day) => {
          const daySessions = selectedSessions.filter((s) => s.day === day.key);
          if (daySessions.length === 0) return null;
          const sorted = [...daySessions].sort((a, b) => (a.startTime ?? "99:99").localeCompare(b.startTime ?? "99:99"));
          return (
            <div key={day.key} className="space-y-3">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-flasha-orange">{day.label}</h2>
              <div className="grid gap-3 sm:grid-cols-2">
                {sorted.map((session) => (
                  <SessionCard key={session.id} session={session} />
                ))}
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}
