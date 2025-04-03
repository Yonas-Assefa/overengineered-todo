import { Repository, IsNull } from "typeorm";
import { Collection } from "../../domain/entities/collection.entity";
import { Task } from "../../domain/entities/task.entity";
import type { ITaskRepository } from "../../domain/interfaces/repository.interface";
import { AppDataSource } from "../database/data-source";
import type { CollectionEntity } from "../database/entities/collection.entity";
import { TaskEntity } from "../database/entities/task.entity";

export class TaskRepository implements ITaskRepository {
  private repo: Repository<TaskEntity>;

  constructor() {
    this.repo = AppDataSource.getRepository(TaskEntity);
  }

  async create(task: Task): Promise<Task> {
    // Map domain Task to TypeORM TaskEntity
    const entity: Partial<TaskEntity> = {
      title: task.title,
      description: task.description || undefined, // Convert null to undefined for TypeORM
      date: task.date,
      completed: task.completed,
      isRecurring: task.isRecurring,
      recurrencePattern: task.recurrencePattern || undefined,
      createdAt: task.createdAt,
      updatedAt: task.updatedAt,
      collection: { id: task.collection.id } as CollectionEntity,
      parentTask: task.parentTask
        ? ({ id: task.parentTask.id } as TaskEntity)
        : undefined,
    };
    const createdEntity = this.repo.create(entity);
    const saved = await this.repo.save(createdEntity);
    return this.toDomain(saved);
  }

  async findById(id: number): Promise<Task | null> {
    const entity = await this.repo.findOne({
      where: { id },
      relations: ["collection", "parentTask", "subtasks"],
    });
    return entity ? this.toDomain(entity) : null;
  }

  async findByCollectionId(collectionId: number): Promise<Task[]> {
    const entities = await this.repo.find({
      where: { 
        collection: { id: collectionId },
        parentTask: IsNull()
      },
      relations: ["collection", "subtasks"], // We don't need parentTask relation here
    });
    return entities.map(this.toDomain.bind(this));
  }

  async update(id: number, task: Partial<Task>): Promise<Task> {
    // Map Partial<Task> to Partial<TaskEntity>
    const updateData: Partial<TaskEntity> = {
      title: task.title,
      description: task.description || undefined, // Handle null -> undefined
      date: task.date,
      completed: task.completed,
      isRecurring: task.isRecurring,
      recurrencePattern: task.recurrencePattern || undefined,
      updatedAt: task.updatedAt || new Date(),
      collection: task.collection
        ? ({ id: task.collection.id } as CollectionEntity)
        : undefined,
      parentTask: task.parentTask
        ? ({ id: task.parentTask.id } as TaskEntity)
        : undefined,
    };
    await this.repo.update(id, updateData);
    const updated = await this.findById(id);
    if (!updated) throw new Error("Task not found after update");
    return updated;
  }

  async delete(id: number): Promise<void> {
    await this.repo.delete(id);
  }

  private toDomain(entity: TaskEntity): Task {
    return new Task(
      entity.id,
      entity.title,
      entity.description || null,
      entity.date,
      entity.completed,
      entity.isRecurring,
      entity.recurrencePattern || null,
      entity.createdAt,
      entity.updatedAt,
      new Collection(
        entity.collection.id,
        entity.collection.name,
        entity.collection.isFavorite,
        entity.collection.createdAt,
        entity.collection.updatedAt
      ),
      entity.parentTask ? ({ id: entity.parentTask.id } as Task) : undefined,
      entity.subtasks?.map(
        (st) =>
          ({
            id: st.id,
            title: st.title,
            description: st.description,
            date: st.date,
            completed: st.completed,
            isRecurring: st.isRecurring,
            recurrencePattern: st.recurrencePattern,
            createdAt: st.createdAt,
            updatedAt: st.updatedAt,
          } as Task)
      ) || []
    );
  }

  private mapCollectionEntityToCollection(
    entity: CollectionEntity
  ): Collection {
    if (entity) {
    }
    return new Collection(
      entity.id,
      entity.name,
      entity.isFavorite,
      entity.createdAt,
      entity.updatedAt,
      entity.tasks?.map((taskEntity) => this.toDomain(taskEntity))
    );
  }
}
