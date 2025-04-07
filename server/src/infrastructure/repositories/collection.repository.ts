import type { Repository } from "typeorm";
import { Collection } from "../../domain/entities/collection.entity";
import { Task } from "../../domain/entities/task.entity";
import type { ICollectionRepository } from "../../domain/interfaces/repository.interface";
import { AppDataSource } from "../database/data-source";
import { CollectionEntity } from "../database/entities/collection.entity";
import type { TaskEntity } from "../database/entities/task.entity";
import Logger from "../middleware/logger/logger";

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
    try {
      Logger.info("CollectionRepository.findAll - Starting", {
        timestamp: new Date().toISOString()
      });

      const entities = await this.repo.find({ relations: ["tasks"] });
      
      Logger.info("CollectionRepository.findAll - Success", {
        count: entities.length,
        timestamp: new Date().toISOString()
      });

      return entities.map(this.toDomain);
    } catch (error) {
      Logger.error("CollectionRepository.findAll - Error", {
        error: error instanceof Error ? error.message : "Unknown error",
        stack: error instanceof Error ? error.stack : undefined,
        timestamp: new Date().toISOString()
      });
      throw error;
    }
  }

  async findById(id: number): Promise<Collection | null> {
    const entity = await this.repo.findOne({
      where: { id },
      relations: [
        "tasks",
        "tasks.collection",
        "tasks.parentTask",
        "tasks.subtasks",
      ],
    });

    return entity ? this.toDomain(entity) : null;
  }

  async update(
    id: number,
    collection: Partial<Collection>
  ): Promise<Collection> {
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
    if (!entity) throw new Error("Collection entity is undefined");
    return new Collection(
      entity.id,
      entity.name,
      entity.isFavorite,
      entity.createdAt,
      entity.updatedAt
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
      entity.parentTask
        ? this.mapTaskEntityToTask(entity.parentTask)
        : undefined,
      entity.subtasks?.map((subtask) => this.mapTaskEntityToTask(subtask))
    );
  }
}
