import httpStatus from "http-status"; // Add this import
import type { NextFunction, Request, Response } from "express";
import type {
  CreateTaskDto,
  UpdateTaskDto,
} from "../../application/dtos/task.dto";
import type { TaskService } from "../../application/services/task.service";
import { Task } from "../../domain/entities/task.entity";

export class TaskController {
  constructor(private service: TaskService) {}

  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const dto: CreateTaskDto = req.body;

      const task = await this.service.createTask(dto);
      res.status(httpStatus.CREATED).json(task);
    } catch (error) {
      next(error);
    }
  };

  findById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = Number.parseInt(req.params.id);
      const task = await this.service.getTaskById(id);
      res.status(httpStatus.OK).json(task);
    } catch (error) {
      next(error);
    }
  };

  findByCollectionId = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const collectionId = Number.parseInt(req.params.collectionId);
      const tasks = await this.service.getTasksByCollectionId(collectionId);
      res.status(httpStatus.OK).json(tasks);
    } catch (error) {
      next(error);
    }
  };

  update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = Number.parseInt(req.params.id);
      const dto: UpdateTaskDto = req.body;
      const task = await this.service.updateTask(id, dto);
      res.status(httpStatus.OK).json(task);
    } catch (error) {
      next(error);
    }
  };

  delete = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = Number.parseInt(req.params.id);
      await this.service.deleteTask(id);
      res.status(httpStatus.NO_CONTENT).send();
    } catch (error) {
      next(error);
    }
  };

  async createSubtask(req: Request, res: Response, next: NextFunction) {
    try {
      const parentId = parseInt(req.params.id);
      const subtaskData: CreateTaskDto = {
        ...req.body,
        parentTaskId: parentId,
      };

      const subtask = await this.service.create(subtaskData);
      res.status(httpStatus.CREATED).json(subtask);
    } catch (error) {
      next(error); // Critical: Pass errors to Express error handler
    }
  }

  async updateSubtask(req: Request, res: Response) {
    const parentId = parseInt(req.params.id);
    const subtaskId = parseInt(req.params.subtaskId);
    const subtaskData: Partial<Task> = req.body;
    const subtask = await this.service.updateSubtask(
      parentId,
      subtaskId,
      subtaskData
    );
    res.status(httpStatus.OK).json(subtask);
  }

  async findByCollection(req: Request, res: Response, next: NextFunction) {
    try {
      const collectionId = parseInt(req.params.collectionId);
      const completed =
        req.query.completed === "true"
          ? true
          : req.query.completed === "false"
          ? false
          : undefined;

      const tasks = await this.service.findByCollection(
        collectionId,
        completed
      );
      res.status(httpStatus.OK).json(tasks);
    } catch (error) {
      next(error); // Critical: Pass errors to Express error handler
    }
  }
}
