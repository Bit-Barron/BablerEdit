import React from "react";
import { useWizardStore } from "../store/wizard-store";

interface WizardRecentProjectsProps {}

export const WizardRecentProjects: React.FC<
  WizardRecentProjectsProps
> = ({}) => {
  const { recentProjects } = useWizardStore();

  return (
    <div>
      <h2 className="text-[16px] font-semibold text-primary mb-3">
        Recent projects:
      </h2>
      <div className="space-y-1">
        {recentProjects.map((project, index) => (
          <button
            key={index}
            className="w-full text-left px-4 py-2 text-primary hover:bg-accent rounded-sm transition-colors text-[13px]"
          >
            {project}
          </button>
        ))}
      </div>
    </div>
  );
};
