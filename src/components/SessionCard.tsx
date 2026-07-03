"use client";

import { useState } from "react";
import Link from "next/link";
import { Session } from "@/data/sessions";
import { formatTimeRange } from "@/lib/time";
import { downloadSessionICS, googleCalendarUrl } from "@/lib/ics";
import { useMySchedule } from "@/lib/useMySchedule";
import { getSpeakersForSession } from "@/lib/speakerLookup";

const TYPE_BADGE: Record<Session["type"], string> = {
  talk: "bg-flasha-teal/10 text-flasha-teal-dark border-flasha-teal/30",
  keynote: "bg-flasha-gold/10 text-amber-800 border-flasha-gold/40",
  meal: "bg-slate-100 text-slate-600 border-slate-200",
  social: "bg-flasha-coral/10 text-flasha-coral border-flasha-coral/30",
  break: "bg-slate-50 text-slate-400 border-slate-200",
  poster: "bg-flasha-sky/10 text-sky-700 border-flasha-sky/40",
};

export default function SessionCard({ session }: { session: Session }) {
  const { isSelected, toggleSelected, getNote, setNote } = useMySchedule();
  const [showNotes, setShowNotes] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const hasDetails = Boolean(session.description || session.objectives?.length);

  const selected = isSelected(session.id);
  const note = getNote(session.id);
  const isBreak = session.type === "break";
  const hasTime = Boolean(session.startTime && session.endTime);
  const speakers = getSpeakersForSession(session.id);

  return (
    <div
      className={`rounded-xl border p-4 space-y-3 transition ${
        isBreak
          ? "border-dashed border-slate-200 bg-slate-50/60"
          : selected
          ? "border-flasha-teal/40 bg-flasha-teal/5 shadow-sm"
          : "border-slate-200 bg-white"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full border ${TYPE_BADGE[session.type]}`}>
              {session.type === "talk" ? session.room : session.type.charAt(0).toUpperCase() + session.type.slice(1)}
            </span>
            {session.type !== "break" && (
              <span className="text-xs text-slate-500">{formatTimeRange(session.startTime, session.endTime)}</span>
            )}
            {session.type !== "talk" && session.room !== "All Rooms" && (
              <span className="text-xs text-slate-400">· {session.room}</span>
            )}
          </div>
          <h3 className={`font-medium leading-snug ${isBreak ? "text-slate-500 text-sm" : "text-slate-900"}`}>
            {session.title}
          </h3>
          {speakers.length > 0 ? (
            <p className="text-sm text-slate-500 mt-0.5">
              {speakers.map((speaker, i) => (
                <span key={speaker.id}>
                  {i > 0 && "; "}
                  <Link href={`/speakers?highlight=${speaker.id}`} className="hover:text-flasha-teal-dark hover:underline">
                    {speaker.name}
                    {speaker.credentials ? `, ${speaker.credentials}` : ""}
                  </Link>
                </span>
              ))}
            </p>
          ) : (
            session.presenters && <p className="text-sm text-slate-500 mt-0.5">{session.presenters}</p>
          )}
          {session.note && <p className="text-xs text-amber-700 mt-1">{session.note}</p>}
        </div>
      </div>

      {!isBreak && (
        <div className="flex flex-wrap items-center gap-2 pt-1">
          {hasDetails && (
            <button
              onClick={() => setShowDetails((v) => !v)}
              className="text-xs font-medium px-3 py-1.5 rounded-lg border border-slate-300 text-slate-700 hover:border-flasha-teal transition"
            >
              {showDetails ? "Hide Details" : "Session Details"}
            </button>
          )}
          <button
            onClick={() => toggleSelected(session.id)}
            className={`text-xs font-medium px-3 py-1.5 rounded-lg border transition ${
              selected
                ? "bg-flasha-teal border-flasha-teal text-white hover:bg-flasha-teal-dark"
                : "bg-white border-slate-300 text-slate-700 hover:border-flasha-teal"
            }`}
          >
            {selected ? "✓ In My Schedule" : "+ Add to My Schedule"}
          </button>
          <button
            onClick={() => setShowNotes((v) => !v)}
            className="text-xs font-medium px-3 py-1.5 rounded-lg border border-slate-300 text-slate-700 hover:border-flasha-teal transition"
          >
            {showNotes ? "Hide Notes" : note ? "Edit Notes" : "Add Notes"}
          </button>
          {hasTime ? (
            <a
              href={googleCalendarUrl(session) ?? undefined}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-medium px-3 py-1.5 rounded-lg border border-slate-300 text-slate-700 hover:border-flasha-teal transition"
            >
              + Google Calendar
            </a>
          ) : (
            <span
              className="text-xs font-medium px-3 py-1.5 rounded-lg border border-slate-300 text-slate-400 opacity-40 cursor-not-allowed"
              title="Time not yet announced"
            >
              + Google Calendar
            </span>
          )}
          <button
            onClick={() => downloadSessionICS(session)}
            disabled={!hasTime}
            className="text-xs font-medium px-3 py-1.5 rounded-lg border border-slate-300 text-slate-700 hover:border-flasha-teal disabled:opacity-40 disabled:cursor-not-allowed transition"
            title={hasTime ? "Download a .ics file (iOS/Apple Calendar, Outlook, etc.)" : "Time not yet announced"}
          >
            + iOS Calendar
          </button>
        </div>
      )}

      {showNotes && !isBreak && (
        <textarea
          value={note}
          onChange={(e) => setNote(session.id, e.target.value)}
          placeholder="Your notes for this session…"
          rows={3}
          className="w-full text-base rounded-lg border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-flasha-teal"
        />
      )}

      {showDetails && hasDetails && (
        <div className="text-sm text-slate-600 space-y-2 border-t border-slate-100 pt-3">
          {session.description && <p>{session.description}</p>}
          {session.objectives && session.objectives.length > 0 && (
            <div>
              <p className="font-medium text-slate-700 text-xs uppercase tracking-wide mb-1">Learning Objectives</p>
              <ul className="list-disc list-inside space-y-0.5">
                {session.objectives.map((obj, i) => (
                  <li key={i}>{obj}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
