import { useState } from "react";
import { PlannerProvider, type Module } from "@/contexts/PlannerContext";
import { Sidebar } from "@/components/Sidebar";
import { FinanceModule } from "@/components/FinanceModule";
import { CalendarModule } from "@/components/CalendarModule";
import { ChecklistModule } from "@/components/ChecklistModule";
import { ReportModule } from "@/components/ReportModule";

const modules: Record<Module, React.ComponentType> = {
  finance: FinanceModule,
  calendar: CalendarModule,
  checklist: ChecklistModule,
  report: ReportModule,
};

const Index = () => {
  const [active, setActive] = useState<Module>("finance");
  const ActiveModule = modules[active];

  return (
    <PlannerProvider>
      <div className="flex h-screen overflow-hidden bg-background print:block">
        <div className="print:hidden">
          <Sidebar active={active} onNavigate={setActive} />
        </div>
        <main className="flex-1 overflow-y-auto">
          <ActiveModule />
        </main>
      </div>
    </PlannerProvider>
  );
};

export default Index;
