"use client";

import { 
  ShieldCheck, 
  Activity, 
  Bug, 
  BrainCircuit, 
  Fingerprint, 
  Lock 
} from "lucide-react";
import { clsx } from "clsx";

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const navItems = [
  { id: "overview", label: "Overview", icon: ShieldCheck },
  { id: "agentic-discovery", label: "Agentic Discovery", icon: Activity },
  { id: "logic-lab", label: "Logic Lab", icon: Bug },
  { id: "privacy-shield", label: "Privacy Shield", icon: BrainCircuit },
  { id: "authorized-framework", label: "Authorized Framework", icon: Fingerprint },
];

export function Sidebar({ activeTab, setActiveTab }: SidebarProps) {
  return (
    <div className="flex h-screen w-64 flex-col border-r border-slate-800 bg-slate-950/50 backdrop-blur-xl">
      <div className="flex h-16 items-center border-b border-slate-800 px-6">
        <Lock className="mr-2 h-6 w-6 text-cyan-400" />
        <span className="text-lg font-bold tracking-wider text-slate-100">
          SECUREWAY
        </span>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-6">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={clsx(
                "flex w-full items-center rounded-lg px-3 py-3 text-sm font-medium transition-all duration-200",
                isActive
                  ? "bg-cyan-500/10 text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.15)] ring-1 ring-cyan-500/20"
                  : "text-slate-400 hover:bg-slate-800/50 hover:text-slate-200"
              )}
            >
              <Icon className={clsx("mr-3 h-5 w-5", isActive ? "text-cyan-400" : "text-slate-500")} />
              {item.label}
            </button>
          );
        })}
      </nav>

      <div className="border-t border-slate-800 p-4">
        <div className="flex items-center gap-3 rounded-lg bg-slate-900/50 p-3 ring-1 ring-slate-800">
          <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-cyan-500 to-blue-600 shadow-lg shadow-cyan-500/20" />
          <div className="flex flex-col">
            <span className="text-xs font-medium text-slate-200">Security Admin</span>
            <span className="text-[10px] text-slate-500">Pro License Active</span>
          </div>
        </div>
      </div>
    </div>
  );
}
