import swaggerJsdoc from "swagger-jsdoc";
import path from "path";

// Determine the environment (development or production)
const isProduction = process.env.NODE_ENV === "production";

// Set the path to the route files based on the environment
const routeFiles = isProduction
  ? path.join(__dirname, "../../dist/presentation/routes/*.js")
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
        url: process.env.BASE_URL || "http://localhost:3000",
        description: "Development server",
      },
    ],
  },
  apis: [routeFiles],
};

export const swaggerSpec = swaggerJsdoc(options);