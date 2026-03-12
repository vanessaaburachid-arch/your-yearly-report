import React, { useState } from "react";
import { usePlanner } from "@/contexts/PlannerContext";
import { Plus, Trash2, TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";

const MONTHS = ["Janeiro","Fevereiro","Março","Abril","Maio","Junho","Julho","Agosto","Setembro","Outubro","Novembro","Dezembro"];

export function FinanceModule() {
  const { finances, addFinance, removeFinance, currentMonth, currentYear, setMonth } = usePlanner();
  const [desc, setDesc] = useState("");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState<"income" | "expense">("income");

  const monthFinances = finances.filter((f) => f.month === currentMonth && f.year === currentYear);
  const totalIncome = monthFinances.filter((f) => f.type === "income").reduce((s, f) => s + f.amount, 0);
  const totalExpense = monthFinances.filter((f) => f.type === "expense").reduce((s, f) => s + f.amount, 0);
  const balance = totalIncome - totalExpense;

  const handleAdd = () => {
    if (!desc.trim() || !amount) return;
    addFinance({
      type,
      description: desc.trim(),
      amount: parseFloat(amount),
      date: new Date().toISOString().slice(0, 10),
      month: currentMonth,
      year: currentYear,
    });
    setDesc("");
    setAmount("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleAdd();
  };

  const prevMonth = () => {
    if (currentMonth === 0) setMonth(11, currentYear - 1);
    else setMonth(currentMonth - 1, currentYear);
  };
  const nextMonth = () => {
    if (currentMonth === 11) setMonth(0, currentYear + 1);
    else setMonth(currentMonth + 1, currentYear);
  };

  return (
    <div className="flex flex-col gap-6 p-6 md:p-8 max-w-3xl mx-auto w-full">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-heading font-bold text-foreground">Finanças</h2>
        <div className="flex items-center gap-2">
          <button onClick={prevMonth} className="p-2 rounded-md hover:bg-accent min-h-[44px] min-w-[44px] flex items-center justify-center text-muted-foreground">←</button>
          <span className="font-heading font-semibold text-sm min-w-[140px] text-center">{MONTHS[currentMonth]} {currentYear}</span>
          <button onClick={nextMonth} className="p-2 rounded-md hover:bg-accent min-h-[44px] min-w-[44px] flex items-center justify-center text-muted-foreground">→</button>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-card rounded-lg p-4 border border-border">
          <div className="flex items-center gap-2 text-income mb-1"><TrendingUp size={16} /><span className="text-xs font-medium uppercase tracking-wide">Receita</span></div>
          <p className="text-xl font-heading font-bold text-income">R$ {totalIncome.toFixed(2)}</p>
        </div>
        <div className="bg-card rounded-lg p-4 border border-border">
          <div className="flex items-center gap-2 text-expense mb-1"><TrendingDown size={16} /><span className="text-xs font-medium uppercase tracking-wide">Despesa</span></div>
          <p className="text-xl font-heading font-bold text-expense">R$ {totalExpense.toFixed(2)}</p>
        </div>
        <div className="bg-card rounded-lg p-4 border border-border">
          <div className="flex items-center gap-2 text-muted-foreground mb-1"><span className="text-xs font-medium uppercase tracking-wide">Saldo</span></div>
          <p className={cn("text-xl font-heading font-bold", balance >= 0 ? "text-income" : "text-expense")}>R$ {balance.toFixed(2)}</p>
        </div>
      </div>

      {/* Quick add */}
      <div className="flex items-center gap-3 bg-card border border-border rounded-lg p-3">
        <select
          value={type}
          onChange={(e) => setType(e.target.value as "income" | "expense")}
          className="bg-background border border-input rounded-md px-3 py-2 text-sm min-h-[44px] font-body"
        >
          <option value="income">Receita</option>
          <option value="expense">Despesa</option>
        </select>
        <input
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Descrição..."
          className="flex-1 bg-background border border-input rounded-md px-3 py-2 text-sm min-h-[44px] font-body"
        />
        <input
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Valor"
          type="number"
          step="0.01"
          className="w-28 bg-background border border-input rounded-md px-3 py-2 text-sm min-h-[44px] font-body"
        />
        <button
          onClick={handleAdd}
          className="bg-primary text-primary-foreground rounded-md p-3 min-h-[44px] min-w-[44px] flex items-center justify-center hover:bg-primary/90 transition-colors"
        >
          <Plus size={18} />
        </button>
      </div>

      {/* List */}
      <div className="flex flex-col gap-2">
        {monthFinances.length === 0 && (
          <p className="text-muted-foreground text-sm text-center py-8">Nenhuma entrada neste mês.</p>
        )}
        {monthFinances.map((f) => (
          <div key={f.id} className="flex items-center justify-between bg-card border border-border rounded-lg px-4 py-3 group">
            <div className="flex items-center gap-3">
              <div className={cn("w-2 h-2 rounded-full shrink-0", f.type === "income" ? "bg-income" : "bg-expense")} />
              <span className="text-sm font-medium text-foreground">{f.description}</span>
            </div>
            <div className="flex items-center gap-3">
              <span className={cn("text-sm font-heading font-semibold", f.type === "income" ? "text-income" : "text-expense")}>
                {f.type === "income" ? "+" : "-"} R$ {f.amount.toFixed(2)}
              </span>
              <button
                onClick={() => removeFinance(f.id)}
                className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive transition-all p-1 min-h-[44px] min-w-[44px] flex items-center justify-center"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
