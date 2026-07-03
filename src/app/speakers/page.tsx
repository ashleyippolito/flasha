"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { SPEAKERS } from "@/data/speakers";

function SpeakersList() {
  const searchParams = useSearchParams();
  const highlight = searchParams.get("highlight");
  const [query, setQuery] = useState("");
  const [expanded, setExpanded] = useState<string | null>(null);
  const [prevHighlight, setPrevHighlight] = useState<string | null>(null);
  const highlightRef = useRef<HTMLDivElement | null>(null);
  const hasScrolled = useRef(false);

  // Adjust state during render instead of in an effect: when the
  // `highlight` search param changes, expand that speaker's card.
  if (highlight !== prevHighlight) {
    setPrevHighlight(highlight);
    if (highlight) setExpanded(highlight);
  }

  useEffect(() => {
    if (highlight && highlightRef.current && !hasScrolled.current) {
      highlightRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
      hasScrolled.current = true;
    }
  }, [highlight, expanded]);

  const filtered = SPEAKERS.filter((s) => s.name.toLowerCase().includes(query.trim().toLowerCase()));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-slate-900">Speakers</h1>
        <p className="text-sm text-slate-500 mt-1">
          Bios pulled from the official conference program. Tap a name for their full bio and sessions.
        </p>
      </div>

      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search speakers by name…"
        className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-flasha-teal"
      />

      <div className="grid gap-3 sm:grid-cols-2">
        {filtered.map((speaker) => {
          const isOpen = expanded === speaker.id;
          const isHighlighted = highlight === speaker.id;
          return (
            <div
              key={speaker.id}
              ref={isHighlighted ? highlightRef : undefined}
              className={`rounded-xl border p-4 space-y-2 transition ${
                isHighlighted ? "border-flasha-teal ring-2 ring-flasha-teal/30" : "border-slate-200 bg-white"
              }`}
            >
              <button
                onClick={() => setExpanded(isOpen ? null : speaker.id)}
                className="w-full flex items-center gap-3 text-left"
              >
                {speaker.photo ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={speaker.photo} alt={speaker.name} className="w-10 h-10 rounded-full object-cover flex-shrink-0" />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-flasha-teal/10 text-flasha-teal-dark flex items-center justify-center flex-shrink-0 font-medium">
                    {speaker.name.charAt(0)}
                  </div>
                )}
                <div className="min-w-0">
                  <p className="font-medium text-slate-900 truncate">{speaker.name}</p>
                  {speaker.credentials && <p className="text-xs text-slate-500 truncate">{speaker.credentials}</p>}
                </div>
              </button>

              {isOpen && (
                <div className="pt-2 border-t border-slate-100 space-y-2 text-sm text-slate-600">
                  {speaker.bio && <p>{speaker.bio}</p>}
                  {speaker.sessions.length > 0 && (
                    <div>
                      <p className="font-medium text-slate-700 text-xs uppercase tracking-wide mb-1">Presenting</p>
                      <ul className="list-disc list-inside space-y-0.5">
                        {speaker.sessions.map((s) => (
                          <li key={s.sessionId}>{s.title}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {speaker.disclosures && <p className="text-xs text-slate-400">{speaker.disclosures}</p>}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <p className="text-sm text-slate-500 text-center py-8">No speakers match &ldquo;{query}&rdquo;.</p>
      )}
    </div>
  );
}

export default function SpeakersPage() {
  return (
    <Suspense fallback={null}>
      <SpeakersList />
    </Suspense>
  );
}
