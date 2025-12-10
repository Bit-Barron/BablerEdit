export const isSameParent = (
  dragId: string,
  parentId: string | null
): boolean => {
  const currentParent = dragId.split(".").slice(0, -1).join(".");
  return currentParent === parentId;
};
