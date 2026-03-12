import React, { createContext, useContext, useState, useCallback } from "react";

export type Module = "finance" | "calendar" | "checklist" | "report";

export interface FinanceEntry {
  id: string;
  type: "income" | "expense";
  description: string;
  amount: number;
  date: string;
  month: number;
  year: number;
}

export interface CalendarEvent {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  month: number;
  year: number;
}

export interface ChecklistItem {
  id: string;
  text: string;
  completed: boolean;
  date: string;
}

interface PlannerState {
  finances: FinanceEntry[];
  events: CalendarEvent[];
  checklist: ChecklistItem[];
  currentMonth: number;
  currentYear: number;
}

interface PlannerContextType extends PlannerState {
  addFinance: (entry: Omit<FinanceEntry, "id">) => void;
  removeFinance: (id: string) => void;
  addEvent: (event: Omit<CalendarEvent, "id">) => void;
  removeEvent: (id: string) => void;
  addChecklistItem: (item: Omit<ChecklistItem, "id" | "completed">) => void;
  toggleChecklistItem: (id: string) => void;
  removeChecklistItem: (id: string) => void;
  setMonth: (month: number, year: number) => void;
}

const PlannerContext = createContext<PlannerContextType | null>(null);

const STORAGE_KEY = "planner-data";

function loadState(): PlannerState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  const now = new Date();
  return {
    finances: [],
    events: [],
    checklist: [],
    currentMonth: now.getMonth(),
    currentYear: now.getFullYear(),
  };
}

function saveState(state: PlannerState) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function uid() {
  return Math.random().toString(36).slice(2, 10);
}

export function PlannerProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<PlannerState>(loadState);

  const update = useCallback((fn: (s: PlannerState) => PlannerState) => {
    setState((prev) => {
      const next = fn(prev);
      saveState(next);
      return next;
    });
  }, []);

  const addFinance = useCallback((entry: Omit<FinanceEntry, "id">) => {
    update((s) => ({ ...s, finances: [...s.finances, { ...entry, id: uid() }] }));
  }, [update]);

  const removeFinance = useCallback((id: string) => {
    update((s) => ({ ...s, finances: s.finances.filter((f) => f.id !== id) }));
  }, [update]);

  const addEvent = useCallback((event: Omit<CalendarEvent, "id">) => {
    update((s) => ({ ...s, events: [...s.events, { ...event, id: uid() }] }));
  }, [update]);

  const removeEvent = useCallback((id: string) => {
    update((s) => ({ ...s, events: s.events.filter((e) => e.id !== id) }));
  }, [update]);

  const addChecklistItem = useCallback((item: Omit<ChecklistItem, "id" | "completed">) => {
    update((s) => ({ ...s, checklist: [...s.checklist, { ...item, id: uid(), completed: false }] }));
  }, [update]);

  const toggleChecklistItem = useCallback((id: string) => {
    update((s) => ({
      ...s,
      checklist: s.checklist.map((c) => (c.id === id ? { ...c, completed: !c.completed } : c)),
    }));
  }, [update]);

  const removeChecklistItem = useCallback((id: string) => {
    update((s) => ({ ...s, checklist: s.checklist.filter((c) => c.id !== id) }));
  }, [update]);

  const setMonth = useCallback((month: number, year: number) => {
    update((s) => ({ ...s, currentMonth: month, currentYear: year }));
  }, [update]);

  return (
    <PlannerContext.Provider
      value={{ ...state, addFinance, removeFinance, addEvent, removeEvent, addChecklistItem, toggleChecklistItem, removeChecklistItem, setMonth }}
    >
      {children}
    </PlannerContext.Provider>
  );
}

export function usePlanner() {
  const ctx = useContext(PlannerContext);
  if (!ctx) throw new Error("usePlanner must be used within PlannerProvider");
  return ctx;
}
