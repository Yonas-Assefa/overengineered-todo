import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./index";
import type { Express } from "express";

export function setupSwagger(app: Express) {
  app.use("/swagger", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
}
