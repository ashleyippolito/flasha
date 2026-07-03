"use client";

import { useCallback } from "react";
import { useLocalStorage } from "./useLocalStorage";

const SELECTED_KEY = "flasha2026:selected-sessions";
const NOTES_KEY = "flasha2026:session-notes";

export function useMySchedule() {
  const [selectedIds, setSelectedIds, hydrated] = useLocalStorage<string[]>(SELECTED_KEY, []);
  const [notes, setNotes] = useLocalStorage<Record<string, string>>(NOTES_KEY, {});

  const isSelected = useCallback((id: string) => selectedIds.includes(id), [selectedIds]);

  const toggleSelected = useCallback(
    (id: string) => {
      setSelectedIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
    },
    [setSelectedIds]
  );

  const setNote = useCallback(
    (id: string, note: string) => {
      setNotes((prev) => ({ ...prev, [id]: note }));
    },
    [setNotes]
  );

  const getNote = useCallback((id: string) => notes[id] ?? "", [notes]);

  return { selectedIds, isSelected, toggleSelected, getNote, setNote, hydrated, loggedIn: true };
}
