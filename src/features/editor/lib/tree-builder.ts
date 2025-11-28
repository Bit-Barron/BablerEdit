export const buildTranslationTree = (obj: any): TreeNode[] => {
  const translations = obj?.translations || {};
  const allKeys = Object.keys(translations).sort();

  const buildNode = (keys: string[], depth: number = 0): TreeNode[] => {
    const grouped = new Map<string, string[]>();

    keys.forEach((key) => {
      console.log("Keys", key);
      const parts = key.split(".");
      const currentPart = parts[depth];

      if (!currentPart) return;

      if (!grouped.has(currentPart)) {
        grouped.set(currentPart, []);
      }
      grouped.get(currentPart)!.push(key);
    });

    console.log("Grouped at depth",  grouped);

    return Array.from(grouped.entries()).map(([part, partKeys]) => {
      const hasDeeper = partKeys.some((k) => k.split(".").length > depth + 1);

      if (!hasDeeper) {
        return {
          id: partKeys[0],
          name: part,
        };
      }

      return {
        id: partKeys[0]
          .split(".")
          .slice(0, depth + 1)
          .join("."),
        name: part,
        children: buildNode(partKeys, depth + 1),
      };
    });
  };

  return buildNode(allKeys);
};
