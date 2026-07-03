import { Session } from "@/data/sessions";

function escapeText(s: string): string {
  return s.replace(/\\/g, "\\\\").replace(/[,;]/g, (m) => `\\${m}`).replace(/\n/g, "\\n");
}

function toICSDateTime(date: string, time: string): string {
  return `${date.replace(/-/g, "")}T${time.replace(":", "")}00`;
}

function dtStamp(): string {
  return new Date().toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
}

function foldLine(line: string): string {
  // RFC5545 recommends folding lines longer than 75 octets
  if (line.length <= 75) return line;
  let result = "";
  let remaining = line;
  while (remaining.length > 75) {
    result += remaining.slice(0, 75) + "\r\n ";
    remaining = remaining.slice(75);
  }
  return result + remaining;
}

function sessionToEvent(session: Session): string[] {
  if (!session.startTime || !session.endTime) return [];
  const descriptionParts = [];
  if (session.presenters) descriptionParts.push(`Presenter(s): ${session.presenters}`);
  if (session.note) descriptionParts.push(session.note);

  const lines = [
    "BEGIN:VEVENT",
    `UID:${session.id}@flasha2026`,
    `DTSTAMP:${dtStamp()}`,
    `DTSTART:${toICSDateTime(session.date, session.startTime)}`,
    `DTEND:${toICSDateTime(session.date, session.endTime)}`,
    `SUMMARY:${escapeText(session.title)}`,
    `LOCATION:${escapeText(session.room)}`,
  ];
  if (descriptionParts.length) {
    lines.push(`DESCRIPTION:${escapeText(descriptionParts.join(" — "))}`);
  }
  lines.push("END:VEVENT");
  return lines.map(foldLine);
}

function buildCalendar(sessions: Session[]): string {
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//FLASHA 2026 Conference Schedule//EN",
    "CALSCALE:GREGORIAN",
    ...sessions.flatMap(sessionToEvent),
    "END:VCALENDAR",
  ];
  return lines.join("\r\n");
}

function download(filename: string, content: string) {
  const blob = new Blob([content], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function downloadSessionICS(session: Session) {
  if (!session.startTime || !session.endTime) return;
  download(`${session.id}.ics`, buildCalendar([session]));
}

export function downloadScheduleICS(sessions: Session[]) {
  const withTimes = sessions.filter((s) => s.startTime && s.endTime);
  if (!withTimes.length) return;
  download("flasha2026-my-schedule.ics", buildCalendar(withTimes));
}
