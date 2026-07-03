# FLASHA 2026 Schedule App — Project Context

Paste this into a new Claude conversation to pick up where things left off.

## What this is

A personal itinerary builder for the 2026 FLASHA Convention ("Connected Voices: AI, Empathy, and the Evolution of Clinical Care"), July 9–11, 2026. Built for Ashley to share with friends attending the conference: browse every session, build a personal schedule, export to calendar, take notes, look up speakers.

- **Location:** `/Users/ashley/flasha-2026` (standalone repo, unrelated to the `Cobalt` repo)
- **GitHub remote:** `https://github.com/ashleyippolito/flasha.git` — remote is configured but **nothing has been pushed yet** (holding off until told to push)
- **Stack:** Next.js 16 (App Router, Turbopack), TypeScript, Tailwind CSS v4. Fully static site — no backend, no database, no API routes.
- **Deployment:** Not yet deployed to Vercel. When ready: push to GitHub, then `vercel.com/new` → import the repo → deploy (zero config needed).

## Persistence model (important — this was revisited once already)

**localStorage only**, scoped per browser. No accounts, no database.

We originally built full username/password accounts backed by a Postgres (Neon) database via Vercel Storage, with signup/login, bcrypt hashing, session cookies, and API routes syncing selections/notes server-side. **This was fully reverted** — for a small friend-group app, Vercel's 0.5GB free Postgres limit wasn't worth the complexity, and localStorage does the job (each friend's picks/notes persist in their own browser). All accounts/DB code was removed (no `api/`, no `lib/db.ts`, `lib/session.ts`, `lib/AuthContext.tsx`, no `pg`/`bcryptjs`/`jose` deps). If a database is still connected in Vercel from that experiment, it's unused now and can be deleted there if desired.

localStorage keys in use:
- `flasha2026:unlocked` — site password gate flag
- `flasha2026:selected-sessions` — array of session IDs in "My Schedule"
- `flasha2026:session-notes` — map of session ID → note text

## Site password gate

`src/components/PasswordGate.tsx` — client-side only, password is `flasha2026`. This is **convenience-level, not real security** (visible in the JS bundle) — fine for keeping casual visitors out while sharing a link with friends, not for anything sensitive.

## Data sources (this took real reconciliation work)

Two sources were used, in this priority order:

1. **Primary: the official vfairs program page** — `https://2026flashaconvention.vfairs.com/en/full-program`. Scraped for full session titles, times, rooms, descriptions, learning objectives, and speaker bios (149 speakers, each with credentials, bio text, disclosures, and headshot where available).
2. **Secondary: printed schedule grid images** (3 images, Thu/Fri/Sat, given by Ashley early on) — used to backfill room numbers where the official page left them blank, and to fill in a couple of sessions missing from the official page entirely.

Where the two sources conflicted (which happened a lot — different titles, times, rooms for the same slot), **the vfairs page won**, per Ashley's explicit decision.

Known data caveats, still true today:
- ~20 session rooms were **backfilled from the printed grid** (vfairs left the room blank) — medium confidence, cross-checked for double-booking conflicts but not officially confirmed.
- **2 sessions are marked "Room TBA"** in the data (`From PVFM and ILO to Unspecified Dyspnea...` and `Unlocking Literacy: The SLP's Secret Superpower`) because no room could be inferred without creating a conflict.
- **2 sessions exist only on the printed grid**, not on the official site at all: "Digital Compliance" (Brabson, Thu 8–9am) and "How SLPs Prevent, Prepare For, and Successfully Navigate Compliance Challenges" (McCormick & Thornton, Fri 11:45am–12:45pm). Both are flagged with an on-card note.
- Conference dates (Thu=2026-07-09, Fri=2026-07-10, Sat=2026-07-11) were inferred/corrected — the original grid images had inconsistent printed dates (stale template leftovers), resolved to a consecutive Thu–Sat block.
- One duplicate-speaker bug was found and fixed: the source site listed "Tin Wai Tiffany Siu" and "Tin Wai (Tiffany) Siu" as two different people; merged into one.

## Branding

Colors were sampled directly from the official 2026 convention logo (downloaded from the vfairs page), not guessed:
- Teal `#00A6A6` (`--flasha-teal`, `--flasha-teal-dark: #018585`)
- Orange `#F7930D`, Gold `#F7A600`, Coral `#EA4E5D`, Sky blue `#50C9E6`

Defined as CSS custom properties in `src/app/globals.css` and mapped into Tailwind v4's `@theme inline` block, used via classes like `bg-flasha-teal`, `text-flasha-teal-dark`, etc.

## Pages & features

- **`/` (Full Schedule)** — day tabs (Thu/Fri/Sat), search box (title/presenter) + room filter dropdown, sessions grouped into time blocks. A time block that's entirely poster sessions collapses into a single "View All →" card linking to `/posters` instead of listing every poster inline.
- **`/my-schedule`** — only the sessions the visitor has added, grouped by day, with a bulk "Download All to Calendar (.ics)" button.
- **`/posters`** — all poster-type sessions (the Friday 12:45–1:45pm and Saturday 12:40–1:40pm Foyer poster blocks), grouped by day.
- **`/speakers`** — searchable directory of all 149 speakers with expandable bios, credentials, disclosures, and the sessions they're presenting. Supports `?highlight=<speakerId>` to auto-expand and scroll to a specific speaker — used when you click a presenter's name on any session card, which links there.
- **Footer** on every page: "Powered by ScriptToolKit © 2025 | Ashley Ippolito, M.S., CCC-SLP"

## Key files

- `src/data/sessions.ts` — `Session` type + `SESSIONS` array (88 sessions) + `DAYS`
- `src/data/speakers.ts` — `Speaker` type + `SPEAKERS` array (149 speakers, each with a `sessions` cross-reference list)
- `src/components/SessionCard.tsx` — the core session card (badge, presenters linked to speaker bios, add-to-schedule toggle, notes, add-to-calendar, expandable session details)
- `src/components/DaySchedule.tsx` — groups sessions into time blocks, collapses all-poster blocks
- `src/lib/useMySchedule.ts` — localStorage-backed hook for selections + notes
- `src/lib/ics.ts` — generates downloadable `.ics` files (single session or bulk)
- `src/lib/speakerLookup.ts` — `getSpeakersForSession(id)` cross-reference helper

## Outstanding / next steps

- [ ] Push to GitHub (`ashleyippolito/flasha`) — waiting on the go-ahead
- [ ] Deploy to Vercel
- [ ] Optionally delete the now-unused Postgres/Neon database resource in Vercel (left over from the reverted accounts experiment)
- [ ] This conversation should happen in a **new Claude Desktop project** pointed at `~/flasha-2026`, not the `Cobalt` project (which is an unrelated repo and caused a naming mix-up: "MISLProject")
