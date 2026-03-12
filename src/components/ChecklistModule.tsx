import React, { useState } from "react";
import { usePlanner } from "@/contexts/PlannerContext";
import { Plus, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

export function ChecklistModule() {
  const { checklist, addChecklistItem, toggleChecklistItem, removeChecklistItem } = usePlanner();
  const [text, setText] = useState("");

  const today = new Date().toISOString().slice(0, 10);
  const todayItems = checklist.filter((c) => c.date === today);
  const completedCount = todayItems.filter((c) => c.completed).length;

  const handleAdd = () => {
    if (!text.trim()) return;
    addChecklistItem({ text: text.trim(), date: today });
    setText("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleAdd();
  };

  return (
    <div className="flex flex-col gap-6 p-6 md:p-8 max-w-2xl mx-auto w-full">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-heading font-bold text-foreground">Checklist Diário</h2>
          <p className="text-sm text-muted-foreground mt-1">
            {todayItems.length > 0
              ? `${completedCount} de ${todayItems.length} concluídos`
              : "Adicione suas tarefas do dia"}
          </p>
        </div>
        <span className="text-sm text-muted-foreground font-body">
          {new Date().toLocaleDateString("pt-BR", { weekday: "long", day: "numeric", month: "long" })}
        </span>
      </div>

      {/* Progress bar */}
      {todayItems.length > 0 && (
        <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
          <div
            className="bg-primary h-full rounded-full transition-all duration-300"
            style={{ width: `${(completedCount / todayItems.length) * 100}%` }}
          />
        </div>
      )}

      {/* Quick add */}
      <div className="flex items-center gap-3">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Adicionar tarefa..."
          className="flex-1 bg-card border border-border rounded-lg px-4 py-3 text-sm min-h-[48px] font-body"
        />
        <button
          onClick={handleAdd}
          className="bg-primary text-primary-foreground rounded-lg p-3 min-h-[48px] min-w-[48px] flex items-center justify-center hover:bg-primary/90 transition-colors"
        >
          <Plus size={20} />
        </button>
      </div>

      {/* Items */}
      <div className="flex flex-col gap-2">
        {todayItems.length === 0 && (
          <p className="text-muted-foreground text-sm text-center py-12">Sua lista está vazia. Comece adicionando tarefas!</p>
        )}
        {todayItems.map((item) => (
          <div
            key={item.id}
            className="flex items-center gap-4 bg-card border border-border rounded-lg px-4 py-3 group"
          >
            <button
              onClick={() => toggleChecklistItem(item.id)}
              className={cn(
                "w-6 h-6 rounded-md border-2 flex items-center justify-center shrink-0 transition-all min-h-[44px] min-w-[44px]",
                item.completed
                  ? "bg-primary border-primary text-primary-foreground animate-check-pop"
                  : "border-input hover:border-primary"
              )}
            >
              {item.completed && (
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M3 7L6 10L11 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </button>
            <span className={cn("flex-1 text-sm", item.completed ? "line-through text-muted-foreground" : "text-foreground")}>{item.text}</span>
            <button
              onClick={() => removeChecklistItem(item.id)}
              className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive transition-all p-1 min-h-[44px] min-w-[44px] flex items-center justify-center"
            >
              <Trash2 size={16} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
