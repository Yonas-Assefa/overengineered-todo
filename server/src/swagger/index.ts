import swaggerJsdoc from "swagger-jsdoc";
import path from "path";

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
        url: process.env.BASE_URL,
        description: "Development server",
      },
    ],
  },
  apis: [path.join(__dirname, "../presentation/routes/*.ts")],
};

export const swaggerSpec = swaggerJsdoc(options);
