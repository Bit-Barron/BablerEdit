import { useSettingsStore } from "@/lib/store/setting.store";
import React from "react";

interface WizardRecentProjectsProps {}

export const WizardRecentProjects: React.FC<
  WizardRecentProjectsProps
> = ({}) => {
  const { recentProjects } = useSettingsStore();

  const projects = Object.values(recentProjects)
    .slice(0, 5)
    .map((proj) => proj!.name);

  console.log(projects);

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
        {projects.map((project: string, index: number) => {
          return (
            <button
              key={index}
              className="glass-bg w-full p-3 text-left text-primary rounded-lg transition-all hover:scale-[1.02]"
            >
              - {project}
            </button>
          );
        })}
      </div>
    </div>
  );
};
