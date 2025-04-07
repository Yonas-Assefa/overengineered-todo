import type { NextFunction, Request, Response } from "express";
import type {
  CreateCollectionDto,
  UpdateCollectionDto,
} from "../../application/dtos/collection.dto";
import type { CollectionService } from "../../application/services/collection.service";
import Logger from "../../infrastructure/middleware/logger/logger";

export class CollectionController {
  constructor(private service: CollectionService) {}

  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const dto: CreateCollectionDto = req.body;
      const collection = await this.service.createCollection(dto);
      res.status(201).json(collection);
    } catch (error) {
      next(error);
    }
  };

  findAll = async (req: Request, res: Response) => {
    try {
      Logger.info("GET /collections - Starting request", {
        query: req.query,
        headers: req.headers,
        timestamp: new Date().toISOString(),
      });

      const collections = await this.service.getAllCollections();

      Logger.info("GET /collections - Success", {
        count: collections.length,
        timestamp: new Date().toISOString(),
      });

      res.status(200).json(collections);
    } catch (error) {
      Logger.error("GET /collections - Error", {
        error: error instanceof Error ? error.message : "Unknown error",
        stack: error instanceof Error ? error.stack : undefined,
        timestamp: new Date().toISOString(),
      });
      throw error;
    }
  };

  findById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = Number.parseInt(req.params.id);
      const collection = await this.service.getCollectionById(id);
      res.json(collection);
    } catch (error) {
      next(error);
    }
  };

  update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = Number.parseInt(req.params.id);
      const dto: UpdateCollectionDto = req.body;
      const collection = await this.service.updateCollection(id, dto);
      res.json(collection);
    } catch (error) {
      next(error);
    }
  };

  delete = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = Number.parseInt(req.params.id);
      await this.service.deleteCollection(id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  };
}
