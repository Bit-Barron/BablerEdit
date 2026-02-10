import React from "react";
import { Tree, TreeApi } from "react-arborist";
import useResizeObserver from "use-resize-observer";

type AutoSizedTreeProps<T> = Omit<
  React.ComponentProps<typeof Tree<T>>,
  "width" | "height"
> & {
  treeRef?: React.Ref<TreeApi<T>>;
};


export function TranslationTree<T>({ treeRef, ...props }: AutoSizedTreeProps<T>) {
  const { ref, width = 0, height = 0 } = useResizeObserver<HTMLDivElement>();

  return (
    <div ref={ref} className="flex-1 min-h-0 border-border-subtle">
      {height > 0 && <Tree<T> ref={treeRef} {...props} width={width} height={height} />}
    </div>
  );
}
