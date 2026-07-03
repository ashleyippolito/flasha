import { SPEAKERS, Speaker } from "@/data/speakers";

export function getSpeakersForSession(sessionId: string): Speaker[] {
  return SPEAKERS.filter((speaker) => speaker.sessions.some((s) => s.sessionId === sessionId));
}
