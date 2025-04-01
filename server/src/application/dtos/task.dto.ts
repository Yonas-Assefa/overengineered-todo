export interface CreateTaskDto {
  title: string;
  description?: string;
  date: Date;
  completed?: boolean;
  isRecurring?: boolean;
  recurrencePattern?: string;
  collectionId: number;
  parentTaskId?: number;
}

export interface UpdateTaskDto {
  title?: string;
  description?: string;
  date?: Date;
  completed?: boolean;
  isRecurring?: boolean;
  recurrencePattern?: string;
  collectionId?: number;
  parentTaskId?: number | null;
}
