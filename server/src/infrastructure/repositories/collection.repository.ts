import type { Repository } from "typeorm";
import { Collection } from "../../domain/entities/collection.entity";
import { Task } from "../../domain/entities/task.entity";
import type { ICollectionRepository } from "../../domain/interfaces/repository.interface";
import { AppDataSource } from "../database/data-source";
import { CollectionEntity } from "../database/entities/collection.entity";
import type { TaskEntity } from "../database/entities/task.entity";

export class CollectionRepository implements ICollectionRepository {
  private repo: Repository<CollectionEntity>;

  constructor() {
    this.repo = AppDataSource.getRepository(CollectionEntity);
  }

  async create(collection: Collection): Promise<Collection> {
    const entity: Partial<CollectionEntity> = {
      name: collection.name,
      isFavorite: collection.isFavorite,
      createdAt: collection.createdAt,
      updatedAt: collection.updatedAt,
    };
    const createdEntity = this.repo.create(entity);
    const saved = await this.repo.save(createdEntity);
    return this.toDomain(saved);
  }

  async findAll(): Promise<Collection[]> {
    const entities = await this.repo.find({ relations: ["tasks"] });
    return entities.map(this.toDomain);
  }

  async findById(id: number): Promise<Collection | null> {
    const entity = await this.repo.findOne({
      where: { id },
      relations: ["tasks"],
    });
    return entity ? this.toDomain(entity) : null;
  }

  async update(id: number, collection: Partial<Collection>): Promise<Collection> {
    const updateData: Partial<CollectionEntity> = {
      name: collection.name,
      isFavorite: collection.isFavorite,
      updatedAt: collection.updatedAt || new Date(),
    };
    await this.repo.update(id, updateData);
    const updated = await this.findById(id);
    if (!updated) throw new Error("Collection not found after update");
    return updated;
  }

  async delete(id: number): Promise<void> {
    await this.repo.delete(id);
  }

  private toDomain(entity: CollectionEntity): Collection {
    return new Collection(
      entity.id,
      entity.name,
      entity.isFavorite,
      entity.createdAt,
      entity.updatedAt,
      entity.tasks?.map((taskEntity) => this.mapTaskEntityToTask(taskEntity)),
    );
  }

  private mapTaskEntityToTask(entity: TaskEntity): Task {
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
      this.toDomain(entity.collection),
      entity.parentTask ? this.mapTaskEntityToTask(entity.parentTask) : undefined,
      entity.subtasks?.map((subtask) => this.mapTaskEntityToTask(subtask)),
    );
  }
}
