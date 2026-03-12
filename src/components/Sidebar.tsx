import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { DollarSign, Calendar, CheckSquare, FileText, PanelLeftClose, PanelLeft } from "lucide-react";
import type { Module } from "@/contexts/PlannerContext";

interface SidebarProps {
  active: Module;
  onNavigate: (module: Module) => void;
}

const navItems: { id: Module; label: string; icon: React.ElementType }[] = [
  { id: "finance", label: "Finanças", icon: DollarSign },
  { id: "calendar", label: "Calendário", icon: Calendar },
  { id: "checklist", label: "Checklist", icon: CheckSquare },
  { id: "report", label: "Relatório Anual", icon: FileText },
];

export function Sidebar({ active, onNavigate }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={cn(
        "flex flex-col border-r border-border bg-card transition-all duration-200",
        collapsed ? "w-16" : "w-60"
      )}
    >
      <div className="flex items-center justify-between p-4">
        {!collapsed && <h1 className="text-lg font-heading font-bold text-foreground truncate">Planner</h1>}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-2 rounded-md hover:bg-accent text-muted-foreground transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
          aria-label={collapsed ? "Expandir menu" : "Recolher menu"}
        >
          {collapsed ? <PanelLeft size={20} /> : <PanelLeftClose size={20} />}
        </button>
      </div>

      <nav className="flex-1 flex flex-col gap-1 px-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = active === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={cn(
                "flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium transition-colors min-h-[48px]",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-accent hover:text-foreground"
              )}
            >
              <Icon size={20} className="shrink-0" />
              {!collapsed && <span className="truncate">{item.label}</span>}
            </button>
          );
        })}
      </nav>
    </aside>
  );
}
