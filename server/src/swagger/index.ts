import swaggerJsdoc from "swagger-jsdoc";
import path from "path";

const isProduction = process.env.NODE_ENV === "production";

const routeFiles = isProduction
  ? path.join(__dirname, "../presentation/routes/*.ts")
  : path.join(__dirname, "../presentation/routes/*.ts");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Overengineered To-Do App API",
      version: "1.0.0",
      description: "API for a To-Do Web Application with overengineering flair",
    },
    servers: [
      {
        url: process.env.BASE_URL || "https://overengineered-todo-production.up.railway.app",
        description: "Production server",
      },
      {
        url: "http://localhost:3000",
        description: "Development server",
      },
    ],
  },
  apis: [routeFiles],
};

export const swaggerSpec = swaggerJsdoc(options);
