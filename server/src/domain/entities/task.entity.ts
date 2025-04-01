import { Collection } from "./collection.entity";

export class Task {
  constructor(
    public id: number,
    public title: string,
    public description: string | null,
    public date: Date,
    public completed: boolean,
    public isRecurring: boolean,
    public recurrencePattern: string | null,
    public createdAt: Date,
    public updatedAt: Date,
    public collection: Collection,
    public parentTask?: Task,
    public subtasks?: Task[]
  ) {}
}
