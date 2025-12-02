import React from "react";
import { Tree } from "react-arborist";
import useResizeObserver from "use-resize-observer";

type AutoSizedTreeProps = Omit<
  React.ComponentProps<typeof Tree>,
  "width" | "height"
>;

export function AutoSizedTree(props: AutoSizedTreeProps) {
  const { ref, width = 0, height = 0 } = useResizeObserver<HTMLDivElement>();

  return (
    <div ref={ref} className="flex-1 min-h-0">
      {height > 0 && <Tree {...props} width={width} height={height} />}
    </div>
  );
}
