import swaggerJsdoc from "swagger-jsdoc";
import path from "path";

const isProduction = process.env.NODE_ENV === "production";

// In production, look for compiled .js files in the dist directory
const routeFiles = isProduction
  ? path.join(__dirname, "../../dist/src/presentation/routes/*.js")
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
    components: {
      schemas: {
        Collection: {
          type: "object",
          properties: {
            id: {
              type: "integer",
              description: "The collection ID"
            },
            name: {
              type: "string",
              description: "The collection name"
            },
            isFavorite: {
              type: "boolean",
              description: "Whether the collection is marked as favorite"
            }
          }
        },
        CreateCollection: {
          type: "object",
          required: ["name"],
          properties: {
            name: {
              type: "string",
              description: "The collection name"
            },
            isFavorite: {
              type: "boolean",
              description: "Whether the collection is marked as favorite"
            }
          }
        },
        UpdateCollection: {
          type: "object",
          properties: {
            name: {
              type: "string",
              description: "The collection name"
            },
            isFavorite: {
              type: "boolean",
              description: "Whether the collection is marked as favorite"
            }
          }
        },
        Task: {
          type: "object",
          properties: {
            id: {
              type: "integer",
              description: "The task ID"
            },
            title: {
              type: "string",
              description: "The task title"
            },
            completed: {
              type: "boolean",
              description: "Whether the task is completed"
            },
            date: {
              type: "string",
              format: "date-time",
              description: "The task due date"
            },
            collectionId: {
              type: "integer",
              description: "The ID of the collection this task belongs to"
            },
            parentTaskId: {
              type: "integer",
              nullable: true,
              description: "The ID of the parent task if this is a subtask"
            }
          }
        },
        CreateTask: {
          type: "object",
          required: ["title"],
          properties: {
            title: {
              type: "string",
              description: "The task title"
            },
            date: {
              type: "string",
              format: "date-time",
              description: "The task due date"
            },
            collectionId: {
              type: "integer",
              description: "The ID of the collection this task belongs to"
            }
          }
        },
        UpdateTask: {
          type: "object",
          properties: {
            title: {
              type: "string",
              description: "The task title"
            },
            completed: {
              type: "boolean",
              description: "Whether the task is completed"
            },
            date: {
              type: "string",
              format: "date-time",
              description: "The task due date"
            }
          }
        },
        Error: {
          type: "object",
          properties: {
            code: {
              type: "integer",
              description: "HTTP status code"
            },
            message: {
              type: "string",
              description: "Error message"
            }
          }
        }
      }
    }
  },
  apis: [routeFiles],
};

export const swaggerSpec = swaggerJsdoc(options);
