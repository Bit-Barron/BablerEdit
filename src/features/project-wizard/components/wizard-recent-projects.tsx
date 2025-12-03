import { useSettingsStore } from "@/features/settings/store/settings.store";
import React from "react";

interface WizardRecentProjectsProps {}

export const WizardRecentProjects: React.FC<
  WizardRecentProjectsProps
> = ({}) => {
  const { recentProjects } = useSettingsStore();

  const projects: any = Object.values(recentProjects)
    .slice(0, 5)
    .map((proj) => proj.name);

  return (
    <div>
      <h2 className="text-[16px] font-semibold text-primary mb-3">
        Recent projects:
      </h2>
      <div className="space-y-1">
        {projects.map((project: string, index: number) => {
          console.log("project", project);
          return (
            <button
              key={index}
              className="w-full p-2 text-left text-primary hover:bg-accent rounded-sm transition-colors"
            >
              - {project}
            </button>
          );
        })}
      </div>
    </div>
  );
};
