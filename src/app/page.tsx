"use client";

import { useMemo, useState } from "react";
import { DAYS, SESSIONS } from "@/data/sessions";
import DaySchedule from "@/components/DaySchedule";

export default function Home() {
  const [activeDay, setActiveDay] = useState<(typeof DAYS)[number]["key"]>(DAYS[0].key);
  const [query, setQuery] = useState("");
  const [room, setRoom] = useState("all");

  const sessionsForDay = SESSIONS.filter((s) => s.day === activeDay);

  const rooms = useMemo(
    () => Array.from(new Set(sessionsForDay.map((s) => s.room))).sort(),
    [sessionsForDay]
  );

  const filtered = sessionsForDay.filter((s) => {
    if (room !== "all" && s.room !== room) return false;
    if (query.trim()) {
      const q = query.trim().toLowerCase();
      const haystack = `${s.title} ${s.presenters ?? ""}`.toLowerCase();
      if (!haystack.includes(q)) return false;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-slate-900">Full Schedule</h1>
        <p className="text-sm text-slate-500 mt-1">
          Browse every session, then add the ones you want to your personal schedule.
        </p>
      </div>

      <div className="flex gap-2 border-b border-slate-200 overflow-x-auto">
        {DAYS.map((day) => (
          <button
            key={day.key}
            onClick={() => {
              setActiveDay(day.key);
              setRoom("all");
            }}
            className={`px-3 py-2 text-sm font-medium border-b-2 -mb-px transition whitespace-nowrap ${
              activeDay === day.key
                ? "border-flasha-teal text-flasha-teal-dark"
                : "border-transparent text-slate-500 hover:text-slate-700"
            }`}
          >
            {day.label}
          </button>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row gap-2">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by title or presenter…"
          className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-flasha-teal"
        />
        <select
          value={room}
          onChange={(e) => setRoom(e.target.value)}
          className="rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-flasha-teal sm:w-48"
        >
          <option value="all">All Rooms</option>
          {rooms.map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>
      </div>

      {filtered.length === 0 ? (
        <p className="text-sm text-slate-500 text-center py-8">No sessions match your filters.</p>
      ) : (
        <DaySchedule sessions={filtered} />
      )}
    </div>
  );
}
