export interface TreeNodeType {
  id: string;
  name: string;
  children?: TreeNodeType[];
}

export interface ReactArboristType {
  dragIds: string[];
  parentId: string | null;
}
