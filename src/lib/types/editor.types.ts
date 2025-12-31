import { NodeApi } from "react-arborist";

export interface TreeNodeType {
  id: string;
  name: string;
  children?: TreeNodeType[];
}

export interface ReactArboristType {
  dragIds: string[];
  dragNodes: NodeApi<TreeNodeType>[];
  parentId: string | null;
  parentNode: NodeApi<TreeNodeType> | null;
  index: number;
}
