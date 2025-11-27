import React from "react";
import { useWelcomeStore } from "../store/welcome-store";

interface WelcomeRecentProjectsProps {}

export const WelcomeRecentProjects: React.FC<
  WelcomeRecentProjectsProps
> = ({}) => {
  const { recentProjects } = useWelcomeStore();

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
