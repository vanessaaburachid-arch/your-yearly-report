import React, { useRef } from "react";
import { usePlanner } from "@/contexts/PlannerContext";
import { Download } from "lucide-react";

const MONTHS = ["Janeiro","Fevereiro","Março","Abril","Maio","Junho","Julho","Agosto","Setembro","Outubro","Novembro","Dezembro"];

export function ReportModule() {
  const { finances, events, checklist, currentYear, setMonth } = usePlanner();
  const reportRef = useRef<HTMLDivElement>(null);

  const yearFinances = finances.filter((f) => f.year === currentYear);
  const yearEvents = events.filter((e) => e.year === currentYear);
  const yearChecklist = checklist.filter((c) => c.date.startsWith(String(currentYear)));

  const totalIncome = yearFinances.filter((f) => f.type === "income").reduce((s, f) => s + f.amount, 0);
  const totalExpense = yearFinances.filter((f) => f.type === "expense").reduce((s, f) => s + f.amount, 0);
  const balance = totalIncome - totalExpense;

  const completedTasks = yearChecklist.filter((c) => c.completed).length;

  const prevYear = () => setMonth(0, currentYear - 1);
  const nextYear = () => setMonth(0, currentYear + 1);

  const handlePrint = () => {
    window.print();
  };

  // Monthly breakdown
  const monthlyData = MONTHS.map((name, idx) => {
    const mf = yearFinances.filter((f) => f.month === idx);
    const inc = mf.filter((f) => f.type === "income").reduce((s, f) => s + f.amount, 0);
    const exp = mf.filter((f) => f.type === "expense").reduce((s, f) => s + f.amount, 0);
    const evCount = yearEvents.filter((e) => e.month === idx).length;
    return { name, income: inc, expense: exp, events: evCount };
  });

  return (
    <div className="flex flex-col gap-6 p-6 md:p-8 max-w-4xl mx-auto w-full">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-heading font-bold text-foreground">Relatório Anual</h2>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <button onClick={prevYear} className="p-2 rounded-md hover:bg-accent min-h-[44px] min-w-[44px] flex items-center justify-center text-muted-foreground">←</button>
            <span className="font-heading font-semibold text-sm min-w-[60px] text-center">{currentYear}</span>
            <button onClick={nextYear} className="p-2 rounded-md hover:bg-accent min-h-[44px] min-w-[44px] flex items-center justify-center text-muted-foreground">→</button>
          </div>
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 bg-primary text-primary-foreground rounded-md px-4 py-2 min-h-[44px] text-sm font-medium hover:bg-primary/90 transition-colors"
          >
            <Download size={16} />
            Exportar PDF
          </button>
        </div>
      </div>

      <div ref={reportRef} className="print:p-8">
        {/* Annual summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <SummaryCard label="Receita Total" value={`R$ ${totalIncome.toFixed(2)}`} variant="income" />
          <SummaryCard label="Despesa Total" value={`R$ ${totalExpense.toFixed(2)}`} variant="expense" />
          <SummaryCard label="Saldo" value={`R$ ${balance.toFixed(2)}`} variant={balance >= 0 ? "income" : "expense"} />
          <SummaryCard label="Compromissos" value={String(yearEvents.length)} variant="neutral" />
        </div>

        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="bg-card border border-border rounded-lg p-4">
            <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Tarefas concluídas</p>
            <p className="text-xl font-heading font-bold text-foreground">{completedTasks} / {yearChecklist.length}</p>
          </div>
          <div className="bg-card border border-border rounded-lg p-4">
            <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Taxa de conclusão</p>
            <p className="text-xl font-heading font-bold text-foreground">
              {yearChecklist.length > 0 ? Math.round((completedTasks / yearChecklist.length) * 100) : 0}%
            </p>
          </div>
        </div>

        {/* Monthly breakdown table */}
        <div className="bg-card border border-border rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left px-4 py-3 font-heading font-semibold text-foreground">Mês</th>
                <th className="text-right px-4 py-3 font-heading font-semibold text-income">Receita</th>
                <th className="text-right px-4 py-3 font-heading font-semibold text-expense">Despesa</th>
                <th className="text-right px-4 py-3 font-heading font-semibold text-foreground">Saldo</th>
                <th className="text-right px-4 py-3 font-heading font-semibold text-muted-foreground">Eventos</th>
              </tr>
            </thead>
            <tbody>
              {monthlyData.map((m) => (
                <tr key={m.name} className="border-b border-border last:border-0 hover:bg-accent/50">
                  <td className="px-4 py-3 text-foreground font-medium">{m.name}</td>
                  <td className="px-4 py-3 text-right text-income">R$ {m.income.toFixed(2)}</td>
                  <td className="px-4 py-3 text-right text-expense">R$ {m.expense.toFixed(2)}</td>
                  <td className={`px-4 py-3 text-right font-semibold ${m.income - m.expense >= 0 ? "text-income" : "text-expense"}`}>
                    R$ {(m.income - m.expense).toFixed(2)}
                  </td>
                  <td className="px-4 py-3 text-right text-muted-foreground">{m.events}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function SummaryCard({ label, value, variant }: { label: string; value: string; variant: "income" | "expense" | "neutral" }) {
  const colorClass = variant === "income" ? "text-income" : variant === "expense" ? "text-expense" : "text-foreground";
  return (
    <div className="bg-card border border-border rounded-lg p-4">
      <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">{label}</p>
      <p className={`text-xl font-heading font-bold ${colorClass}`}>{value}</p>
    </div>
  );
}
