import React, { useState } from "react";
import { usePlanner } from "@/contexts/PlannerContext";
import { Plus, Trash2, MapPin, Clock } from "lucide-react";

const MONTHS = ["Janeiro","Fevereiro","Março","Abril","Maio","Junho","Julho","Agosto","Setembro","Outubro","Novembro","Dezembro"];
const WEEKDAYS = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

function getDaysInMonth(month: number, year: number) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(month: number, year: number) {
  return new Date(year, month, 1).getDay();
}

export function CalendarModule() {
  const { events, addEvent, removeEvent, currentMonth, currentYear, setMonth } = usePlanner();
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [title, setTitle] = useState("");
  const [time, setTime] = useState("");
  const [location, setLocation] = useState("");

  const daysInMonth = getDaysInMonth(currentMonth, currentYear);
  const firstDay = getFirstDayOfMonth(currentMonth, currentYear);
  const monthEvents = events.filter((e) => e.month === currentMonth && e.year === currentYear);

  const prevMonth = () => {
    if (currentMonth === 0) setMonth(11, currentYear - 1);
    else setMonth(currentMonth - 1, currentYear);
    setSelectedDay(null);
  };
  const nextMonth = () => {
    if (currentMonth === 11) setMonth(0, currentYear + 1);
    else setMonth(currentMonth + 1, currentYear);
    setSelectedDay(null);
  };

  const handleAdd = () => {
    if (!title.trim() || selectedDay === null) return;
    const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-${String(selectedDay).padStart(2, "0")}`;
    addEvent({ title: title.trim(), date: dateStr, time, location, month: currentMonth, year: currentYear });
    setTitle("");
    setTime("");
    setLocation("");
  };

  const dayEvents = selectedDay
    ? monthEvents.filter((e) => parseInt(e.date.split("-")[2]) === selectedDay)
    : [];

  const today = new Date();
  const isToday = (day: number) => day === today.getDate() && currentMonth === today.getMonth() && currentYear === today.getFullYear();

  return (
    <div className="flex flex-col gap-6 p-6 md:p-8 max-w-4xl mx-auto w-full">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-heading font-bold text-foreground">Calendário</h2>
        <div className="flex items-center gap-2">
          <button onClick={prevMonth} className="p-2 rounded-md hover:bg-accent min-h-[44px] min-w-[44px] flex items-center justify-center text-muted-foreground">←</button>
          <span className="font-heading font-semibold text-sm min-w-[140px] text-center">{MONTHS[currentMonth]} {currentYear}</span>
          <button onClick={nextMonth} className="p-2 rounded-md hover:bg-accent min-h-[44px] min-w-[44px] flex items-center justify-center text-muted-foreground">→</button>
        </div>
      </div>

      {/* Calendar grid */}
      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <div className="grid grid-cols-7">
          {WEEKDAYS.map((d) => (
            <div key={d} className="py-3 text-center text-xs font-medium text-muted-foreground uppercase tracking-wider border-b border-border">{d}</div>
          ))}
        </div>
        <div className="grid grid-cols-7">
          {Array.from({ length: firstDay }).map((_, i) => (
            <div key={`empty-${i}`} className="aspect-square border-b border-r border-border" />
          ))}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const day = i + 1;
            const hasEvents = monthEvents.some((e) => parseInt(e.date.split("-")[2]) === day);
            const selected = selectedDay === day;
            return (
              <button
                key={day}
                onClick={() => setSelectedDay(selected ? null : day)}
                className={`aspect-square border-b border-r border-border flex flex-col items-center justify-center gap-1 text-sm transition-colors min-h-[60px] ${
                  selected ? "bg-primary/10 ring-2 ring-primary ring-inset" : "hover:bg-accent"
                } ${isToday(day) ? "font-bold" : ""}`}
              >
                <span className={isToday(day) ? "bg-primary text-primary-foreground w-7 h-7 rounded-full flex items-center justify-center text-xs" : "text-foreground"}>{day}</span>
                {hasEvents && <div className="w-1.5 h-1.5 rounded-full bg-primary" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected day panel */}
      {selectedDay !== null && (
        <div className="bg-card border border-border rounded-lg p-5">
          <h3 className="font-heading font-semibold text-foreground mb-4">{selectedDay} de {MONTHS[currentMonth]}</h3>

          {/* Quick add */}
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Compromisso..." className="flex-1 min-w-[150px] bg-background border border-input rounded-md px-3 py-2 text-sm min-h-[44px] font-body" />
            <input value={time} onChange={(e) => setTime(e.target.value)} placeholder="Horário" type="time" className="bg-background border border-input rounded-md px-3 py-2 text-sm min-h-[44px] font-body w-32" />
            <input value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Local" className="bg-background border border-input rounded-md px-3 py-2 text-sm min-h-[44px] font-body w-40" />
            <button onClick={handleAdd} className="bg-primary text-primary-foreground rounded-md p-3 min-h-[44px] min-w-[44px] flex items-center justify-center hover:bg-primary/90 transition-colors">
              <Plus size={18} />
            </button>
          </div>

          {dayEvents.length === 0 && <p className="text-muted-foreground text-sm">Nenhum compromisso neste dia.</p>}
          {dayEvents.map((ev) => (
            <div key={ev.id} className="flex items-center justify-between py-3 border-b border-border last:border-0 group">
              <div>
                <p className="text-sm font-medium text-foreground">{ev.title}</p>
                <div className="flex items-center gap-3 mt-1">
                  {ev.time && <span className="flex items-center gap-1 text-xs text-muted-foreground"><Clock size={12} />{ev.time}</span>}
                  {ev.location && <span className="flex items-center gap-1 text-xs text-muted-foreground"><MapPin size={12} />{ev.location}</span>}
                </div>
              </div>
              <button onClick={() => removeEvent(ev.id)} className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive transition-all p-1 min-h-[44px] min-w-[44px] flex items-center justify-center">
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
