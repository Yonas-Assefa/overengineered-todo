import swaggerJsdoc from "swagger-jsdoc";
import "./presentation/schemas";
const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Overengineered To-Do App API",
      version: "1.0.0",
      description: "API for an overengineered To-Do App",
    },
  },
  apis: [
    "./src/presentation/routes/*.ts",
    "./src/presentation/controllers/*.ts",
  ],
};

export const swaggerSpec = swaggerJsdoc(options);
