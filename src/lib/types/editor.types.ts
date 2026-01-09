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


export interface TranslationOptionsProps {
  id: string;
  label: string;
  desc: string;
  selected: boolean
}

export type Lang = {
  code: string,
  isNewlyAdded?: boolean
}


