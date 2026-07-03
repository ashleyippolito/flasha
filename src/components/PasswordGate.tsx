"use client";

import { FormEvent, useState } from "react";
import { useLocalStorage } from "@/lib/useLocalStorage";

const UNLOCK_KEY = "flasha2026:unlocked";
const PASSWORD = "flasha2026";

export default function PasswordGate({ children }: { children: React.ReactNode }) {
  const [unlocked, setUnlocked, hydrated] = useLocalStorage<boolean>(UNLOCK_KEY, false);
  const [attempt, setAttempt] = useState("");
  const [error, setError] = useState(false);

  if (!hydrated) return null;

  if (!unlocked) {
    const handleSubmit = (e: FormEvent) => {
      e.preventDefault();
      if (attempt.trim().toLowerCase() === PASSWORD) {
        setUnlocked(true);
        setError(false);
      } else {
        setError(true);
      }
    };

    return (
      <div
        className="min-h-screen flex items-center justify-center px-4"
        style={{ background: "linear-gradient(160deg, #fff7ea 0%, #ffffff 55%)" }}
      >
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-sm bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-4"
        >
          <div>
            <div
              className="h-1.5 w-14 rounded-full mb-4"
              style={{ background: "linear-gradient(90deg, var(--flasha-gold), var(--flasha-orange), var(--flasha-coral))" }}
            />
            <h1 className="text-lg font-semibold text-flasha-teal-dark">FLASHA 2026 Schedule</h1>
            <p className="text-sm text-slate-500 mt-1">Enter the password to view the conference itinerary.</p>
          </div>

          <div className="rounded-lg border-2 border-flasha-coral bg-flasha-coral/10 px-3 py-2.5">
            <p className="text-sm font-semibold text-flasha-coral">
              ⚠ Use the same device and browser every time.
            </p>
            <p className="text-xs text-slate-600 mt-1">
              Your saved schedule and notes live only in this browser on this device — there are no
              accounts, so nothing syncs. Switching phones, computers, or browsers (or clearing your
              browser data) means starting over.
            </p>
          </div>

          <input
            type="password"
            autoFocus
            value={attempt}
            onChange={(e) => {
              setAttempt(e.target.value);
              setError(false);
            }}
            placeholder="Password"
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-flasha-teal"
          />
          {error && <p className="text-sm text-flasha-coral">Incorrect password. Try again.</p>}
          <button
            type="submit"
            className="w-full rounded-lg bg-flasha-teal text-white py-2 text-sm font-medium hover:bg-flasha-teal-dark transition"
          >
            Unlock
          </button>
        </form>
      </div>
    );
  }

  return <>{children}</>;
}
