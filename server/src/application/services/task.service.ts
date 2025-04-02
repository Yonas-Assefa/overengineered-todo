import httpStatus from "http-status"; // Add this import
import { Collection } from "../../domain/entities/collection.entity";
import { Task } from "../../domain/entities/task.entity";
import type {
  ICollectionRepository,
  ITaskRepository,
} from "../../domain/interfaces/repository.interface";
import { ApiError } from "../../infrastructure/middleware/errors/api.error"; // Fix typo in import
import type { CreateTaskDto, UpdateTaskDto } from "../dtos/task.dto";

export class TaskService {
  constructor(
    private taskRepository: ITaskRepository,
    private collectionRepository: ICollectionRepository
  ) {}

  async createTask(dto: CreateTaskDto): Promise<Task> {
    const collection = await this.collectionRepository.findById(
      dto.collectionId
    );

    if (!collection)
      throw new ApiError(httpStatus.NOT_FOUND, "Collection not found");
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
      collection
    );

    if (dto.parentTaskId) {
      const parentTask = await this.taskRepository.findById(dto.parentTaskId);
      if (!parentTask)
        throw new ApiError(httpStatus.NOT_FOUND, "Parent task not found");
      task.parentTask = parentTask;
    }

    return this.taskRepository.create(task);
  }

  async getTaskById(id: number): Promise<Task> {
    const task = await this.taskRepository.findById(id);
    if (!task) throw new ApiError(httpStatus.NOT_FOUND, "Task not found");
    return task;
  }

  async getTasksByCollectionId(collectionId: number): Promise<Task[]> {
    return this.taskRepository.findByCollectionId(collectionId);
  }

  async updateTask(id: number, dto: UpdateTaskDto): Promise<Task> {
    const task = await this.getTaskById(id);
    if (dto.collectionId) {
      const collection = await this.collectionRepository.findById(
        dto.collectionId
      );
      if (!collection)
        throw new ApiError(httpStatus.NOT_FOUND, "Collection not found");
      task.collection = collection;
    }
    if (dto.parentTaskId) {
      const parentTask = await this.taskRepository.findById(dto.parentTaskId);
      if (!parentTask)
        throw new ApiError(httpStatus.NOT_FOUND, "Parent task not found");
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

  async create(taskData: CreateTaskDto): Promise<Task> {
    if (taskData.parentTaskId) {
      const parentTask = await this.taskRepository.findById(
        taskData.parentTaskId
      );
      if (!parentTask)
        throw new ApiError(httpStatus.BAD_REQUEST, "Parent task not found");
    }
    const collection = await this.collectionRepository.findById(
      taskData.collectionId
    );
    if (!collection)
      throw new ApiError(httpStatus.NOT_FOUND, "Collection not found");

    const newTask = new Task(
      0,
      taskData.title,
      taskData.description || null,
      new Date(taskData.date),
      taskData.completed || false,
      taskData.isRecurring || false,
      taskData.recurrencePattern || null,
      new Date(),
      new Date(),
      collection,
      undefined,
      []
    );
    if (taskData.parentTaskId)
      newTask.parentTask = { id: taskData.parentTaskId } as Task;
    return this.taskRepository.create(newTask);
  }

  async updateSubtask(
    parentId: number,
    subtaskId: number,
    taskData: Partial<Task>
  ): Promise<Task> {
    const subtask = await this.taskRepository.findById(subtaskId);
    if (!subtask || subtask.parentTask?.id !== parentId) {
      throw new ApiError(
        httpStatus.NOT_FOUND,
        "Subtask not found or not a child of this parent"
      );
    }
    return this.taskRepository.update(subtaskId, taskData);
  }

  async update(id: number, taskData: Partial<Task>): Promise<Task> {
    const task = await this.taskRepository.findById(id);
    if (!task) throw new ApiError(httpStatus.NOT_FOUND, "Task not found");
    if (taskData.completed === true && task.subtasks?.length) {
      for (const subtask of task.subtasks) {
        await this.taskRepository.update(subtask.id, { completed: true });
      }
    }
    return this.taskRepository.update(id, taskData);
  }

  async findByCollection(
    collectionId: number,
    completed?: boolean
  ): Promise<Task[]> {
    const tasks = await this.taskRepository.findByCollectionId(collectionId);

    return completed !== undefined
      ? tasks.filter((t) => t.completed === completed)
      : tasks;
  }
}
