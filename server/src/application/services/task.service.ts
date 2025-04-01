import { Task } from "../../domain/entities/task.entity";
import type { ICollectionRepository, ITaskRepository } from "../../domain/interfaces/repository.interface";
import type { CreateTaskDto, UpdateTaskDto } from "../dtos/task.dto";

export class TaskService {
  constructor(
    private taskRepository: ITaskRepository,
    private collectionRepository: ICollectionRepository,
  ) {}

  async createTask(dto: CreateTaskDto): Promise<Task> {
    const collection = await this.collectionRepository.findById(dto.collectionId);
    if (!collection) throw new Error("Collection not found");

    const task = new Task(
      0,
      dto.title,
      dto.description || null,
      dto.date,
      dto.completed ?? false,
      dto.isRecurring ?? false,
      dto.recurrencePattern || null,
      new Date(),
      new Date(),
      collection,
    );

    if (dto.parentTaskId) {
      const parentTask = await this.taskRepository.findById(dto.parentTaskId);
      if (!parentTask) throw new Error("Parent task not found");
      task.parentTask = parentTask;
    }

    return this.taskRepository.create(task);
  }

  async getTaskById(id: number): Promise<Task> {
    const task = await this.taskRepository.findById(id);
    if (!task) throw new Error("Task not found");
    return task;
  }

  async getTasksByCollectionId(collectionId: number): Promise<Task[]> {
    return this.taskRepository.findByCollectionId(collectionId);
  }

  async updateTask(id: number, dto: UpdateTaskDto): Promise<Task> {
    const task = await this.getTaskById(id);
    if (dto.collectionId) {
      const collection = await this.collectionRepository.findById(dto.collectionId);
      if (!collection) throw new Error("Collection not found");
      task.collection = collection;
    }
    if (dto.parentTaskId) {
      const parentTask = await this.taskRepository.findById(dto.parentTaskId);
      if (!parentTask) throw new Error("Parent task not found");
      task.parentTask = parentTask;
    }
    return this.taskRepository.update(id, {
      ...task,
      ...dto,
      updatedAt: new Date(),
    });
  }

  async deleteTask(id: number): Promise<void> {
    await this.getTaskById(id);
    return this.taskRepository.delete(id);
  }
}
