import type { Collection } from "../entities/collection.entity";
import type { Task } from "../entities/task.entity";

export interface ICollectionRepository {
  create(collection: Collection): Promise<Collection>;
  findAll(): Promise<Collection[]>;
  findById(id: number): Promise<Collection | null>;
  update(id: number, collection: Partial<Collection>): Promise<Collection>;
  delete(id: number): Promise<void>;
}

export interface ITaskRepository {
  create(task: Task): Promise<Task>;
  findById(id: number): Promise<Task | null>;
  findByCollectionId(collectionId: number): Promise<Task[]>;
  update(id: number, task: Partial<Task>): Promise<Task>;
  delete(id: number): Promise<void>;
}
