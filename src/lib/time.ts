export function formatTime(time: string | null): string {
  if (!time) return "Time TBD";
  const [hStr, mStr] = time.split(":");
  const h = parseInt(hStr, 10);
  const period = h >= 12 ? "PM" : "AM";
  const displayHour = h % 12 === 0 ? 12 : h % 12;
  return mStr === "00" ? `${displayHour} ${period}` : `${displayHour}:${mStr} ${period}`;
}

export function formatTimeRange(start: string | null, end: string | null): string {
  if (!start || !end) return "Time TBD";
  return `${formatTime(start)} – ${formatTime(end)}`;
}
