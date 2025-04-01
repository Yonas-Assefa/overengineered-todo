import { Task } from "./task.entity";
export class Collection {
  constructor(
    public id: number,
    public name: string,
    public isFavorite: boolean,
    public createdAt: Date,
    public updatedAt: Date,
    public tasks?: Task[]
  ) {}
}
