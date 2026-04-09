/**
 * EditorTabs — Reusable tabs component for complex admin form editors.
 * Used inside FormSheet to organize content into logical sections.
 *
 * @example
 * <EditorTabs
 *   tabs={[
 *     { id: "general", label: "Thông tin chung", icon: FileText, content: <GeneralFields /> },
 *     { id: "specs",   label: "Kỹ thuật",       icon: Settings, content: <SpecFields /> },
 *   ]}
 *   defaultTab="general"
 * />
 */

import { useState } from "react";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

export interface EditorTab {
  id: string;
  label: string;
  icon: LucideIcon;
  content: React.ReactNode;
}

interface EditorTabsProps {
  tabs: EditorTab[];
  defaultTab?: string;
  className?: string;
}

export function EditorTabs({ tabs, defaultTab, className }: EditorTabsProps) {
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.id || "");

  const activeContent = tabs.find((t) => t.id === activeTab)?.content;

  return (
    <div className={cn("flex h-full flex-col", className)}>
      {/* Tab bar — sticky at top of scroll area */}
      <div className="sticky top-0 z-10 flex shrink-0 border-b bg-white">
        {tabs.map((tab) => {
          const isActive = tab.id === activeTab;
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex items-center gap-2 px-5 py-3 text-sm font-medium transition-colors relative",
                isActive
                  ? "text-primary"
                  : "text-slate-500 hover:text-slate-900 hover:bg-slate-50",
              )}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {tab.label}
              {/* Active indicator */}
              {isActive && (
                <span className="absolute inset-x-0 bottom-0 h-0.5 bg-primary rounded-t-full" />
              )}
            </button>
          );
        })}
      </div>

      {/* Tab content */}
      <div className="flex-1 overflow-y-auto p-6">
        {activeContent}
      </div>
    </div>
  );
}
