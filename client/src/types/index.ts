export interface Collection {
  id: number;
  name: string;
  createdAt: string;
  updatedAt: string;
  isFavorite: boolean;
}

export interface CollectionFormData {
  name: string;
  isFavorite: boolean;
}

export interface Task {
  id: number;
  title: string;
  date: string;
  completed: boolean;
  collectionId: number;
  subtasks?: Subtask[];
}

export interface Subtask {
  id: number;
  title: string;
  completed: boolean;
  taskId: number;
}
