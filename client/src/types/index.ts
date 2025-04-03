export interface Collection {
  id: number;
  name: string;
  createdAt: string;
  updatedAt: string;
  isFavorite: boolean;
  completedTasks: number;
  totalTasks: number;
  iconBg?: string;
  progressColor?: string;
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

export interface TaskForExcludeFields extends Task {
  id: number;
  createdAt: string;
  updatedAt: string;
  recurrencePattern: string;
}

export interface Subtask {
  id: number;
  title: string;
  completed: boolean;
  taskId: number;
}
