import React from "react";
import { Tree } from "react-arborist";
import useResizeObserver from "use-resize-observer";

type AutoSizedTreeProps<T> = Omit<
  React.ComponentProps<typeof Tree<T>>,
  "width" | "height"
>;


export function TranslationTree<T>(props: AutoSizedTreeProps<T>) {
  const { ref, width = 0, height = 0 } = useResizeObserver<HTMLDivElement>();

  return (
    <div ref={ref} className="flex-1 min-h-0 border-border-subtle">
      {height > 0 && <Tree<T> {...props} width={width} height={height} />}
    </div>
  );
}
