import { useSettings } from "@/hooks/use-settings";
import { useSettingsStore } from "@/lib/store/setting.store";
import React from "react";

interface WizardRecentProjectsProps {}

export const WizardRecentProjects: React.FC<
  WizardRecentProjectsProps
> = ({}) => {
  const { recentProjects } = useSettingsStore();
  const { handleRecentProjectClick } = useSettings();

  const projects = Object.values(recentProjects)
    .slice(0, 5)
    .map((proj) => proj!.name);

  return (
    <div>
      <h2 className="text-[16px] font-semibold text-primary mb-3">
        Recent projects:
      </h2>
      {projects.length === 0 && (
        <p className="text-sm text-muted-foreground">
          No recent projects found.
        </p>
      )}
      <div className="space-y-2">
        {Object.values(recentProjects).map((proj, index) => {
          return (
            <button
              key={index}
              className="glass-bg w-full p-3 text-left text-primary rounded-lg transition-all hover:scale-[1.02]"
              onClick={() => handleRecentProjectClick(proj!.path)}
            >
              - {proj.name}
            </button>
          );
        })}
      </div>
    </div>
  );
};
