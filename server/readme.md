Overengineered To-Do App (Backend)
This is the backend implementation of an overengineered to-do list application built with Node.js, Express, TypeScript, and MySQL, following Clean Architecture principles. The app supports CRUD operations for tasks and collections, with features like nested subtasks, favorites, and a robust type-safe codebase.
Project Overview
The goal of this project is to create a scalable, maintainable, and testable backend for a to-do list application. It adheres to Clean Architecture to separate business logic from infrastructure concerns, making it easy to extend or modify in the future.
Features
CRUD Operations: Create, read, update, and delete tasks and collections.

Nested Subtasks: Tasks can have subtasks, with cascading completion and deletion.

Collections: Group tasks into collections, with support for marking as favorites.

Type Safety: Full TypeScript support across the stack.

Database: MySQL with TypeORM for ORM and migrations.

Logging: Winston for detailed request and error logging.

Folder Structure
The project is organized following Clean Architecture principles, with distinct layers for domain, application, infrastructure, and presentation.

src/
├── domain/ # Core business logic (independent of frameworks)
│ ├── entities/ # Domain entities (Collection, Task)
│ └── interfaces/ # Repository interfaces
├── application/ # Business use cases and DTOs
│ ├── dtos/ # Data Transfer Objects for input/output
│ └── services/ # Use case implementations (e.g., CollectionService)
├── infrastructure/ # External systems and implementations
│ ├── config/ # Configuration (env vars, database settings)
│ ├── database/ # Database-related files
│ │ ├── entities/ # TypeORM entities
│ │ ├── migrations/ # Database migrations
│ │ └── data-source.ts # TypeORM data source configuration
│ ├── middleware/ # Express middleware (validation, errors, logging)
│ ├── logger/ # Winston logging setup
│ └── repositories/ # Concrete repository implementations
├── presentation/ # API layer (routes, controllers, validators)
│ ├── controllers/ # Express controllers
│ ├── routes/ # Express route definitions
│ └── validators/ # Joi validation schemas
├── utils/ # Shared utility functions
│ ├── pick.ts # Utility to pick object properties
│ └── catchAsync.ts # Async error handling wrapper
└── server.ts # Application entry point

Folder Details
domain/: Contains the core business entities (Collection, Task) and interfaces (e.g., ICollectionRepository). This layer is pure TypeScript and independent of external frameworks.

application/: Houses use cases (services) that implement business logic and DTOs for data validation and transfer between layers.

infrastructure/: Manages external concerns like database access (TypeORM), middleware, logging, and configuration.

presentation/: Defines the API layer, including Express routes, controllers, and validation logic.

utils/: General-purpose utilities used across layers.

Setup Guidelines
Prerequisites
Node.js: v16 or higher

npm: v8 or higher

MySQL: v8.0 or higher (running locally or via Docker)

TypeScript: Installed globally or via npm

Installation
Clone the Repository:
bash

git clone https://github.com/your-username/overengineered-todo.git
cd overengineered-todo/server

Install Dependencies:
bash

npm install

Set Up Environment Variables:
Create a .env file in the root directory based on .env.example (if provided) or use the following template:

NODE_ENV=development
PORT=3000
JWT_SECRET=your-secret-key
JWT_ACCESS_EXPIRATION_MINUTES=30
JWT_REFRESH_EXPIRATION_DAYS=30
BASE_URL=http://localhost:3000
DB_HOST=localhost
DB_PORT=3306
DB_USER=your-mysql-user
DB_PASSWORD=your-mysql-password
DB_NAME=task_database
DB_MIGRATIONS_RUN=true

Adjust the DB\_\* variables to match your MySQL setup.

Set Up MySQL Database:
Ensure MySQL is running locally or via Docker:
bash

docker run -d -p 3306:3306 --name mysql -e MYSQL_ROOT_PASSWORD=root -e MYSQL_DATABASE=task_database mysql:8

Update .env with the correct credentials if using Docker (DB_PASSWORD=root, DB_NAME=task_database).

Run Migrations:
Initialize the database schema:
bash

npm run migration:run

Running the Project Locally
Development Mode
Start the server with hot-reloading via ts-node:
bash

npm run dev

The server will run on http://localhost:3000 (or the port specified in .env).

Verify it’s running:
Check the console for logs like:

[2025-04-01 12:00:00] - [info] - Connected to the MySQL database
[2025-04-01 12:00:00] - [info] - Server is running on port 3000

API Endpoints
Collections:
GET /collections: List all collections

POST /collections: Create a new collection

GET /collections/:id: Get a collection by ID

PATCH /collections/:id: Update a collection

DELETE /collections/:id: Delete a collection

Tasks:
POST /tasks: Create a new task

GET /tasks/:id: Get a task by ID

GET /tasks/collection/:collectionId: List tasks by collection ID

PATCH /tasks/:id: Update a task

DELETE /tasks/:id: Delete a task

Test with a tool like Postman or curl. Example:
bash

curl -X POST http://localhost:3000/collections -H "Content-Type: application/json" -d '{"name": "Work", "isFavorite": true}'

Packages Used
Core:
express: Web framework for Node.js

typescript: Type safety and development experience

ts-node: Run TypeScript directly in development

Database:
typeorm: ORM for MySQL

mysql2: MySQL driver

Validation:
joi: Schema validation for API inputs

Logging:
winston: Logging library

morgan: HTTP request logging middleware

Configuration:
dotenv: Environment variable management

Utilities:
http-status: HTTP status codes

Development:
@biomejs/biome: Linting and formatting

mocha: Testing framework (for future tests)

Full list in package.json.
Architecture
This project follows Clean Architecture, emphasizing separation of concerns and dependency inversion:
Layers
Domain:
Core entities (Collection, Task) and interfaces.

Independent of frameworks or external systems.

Application:
Use cases (services) that orchestrate business logic.

DTOs for data transfer between layers.

Infrastructure:
Concrete implementations (e.g., TypeORM repositories, middleware, logging).

Depends on domain and application layers.

Presentation:
API layer with Express routes, controllers, and validators.

Entry point for external requests.

Key Decisions
Dependency Injection: Services and repositories are instantiated in server.ts and passed to controllers, avoiding tight coupling.

TypeORM Entities vs. Domain Entities: Separate TypeORM entities (CollectionEntity, TaskEntity) for database mapping and domain entities for business logic, with mapping in repositories.

Error Handling: Centralized error middleware (errorConverter, errorHandler) for consistent API responses.

Testing (Future Work)
Unit tests can be added in tests/ using Mocha:
bash

npm run test

Focus on testing services (CollectionService, TaskService) by mocking repositories.

Bonus Features
Favorites: Collections can be marked as favorites via the isFavorite field.

Nested Subtasks: Tasks support parent-child relationships with cascading deletion.

Notes
Scalability: The structure supports adding new features (e.g., authentication, theming) by extending services and routes.

Environment: Configurable via .env for development, production, or testing.

Contributions
Feel free to fork, submit PRs, or open issues on GitHub. Follow the existing structure and run npm run lint:fix before committing.
Happy coding! Let me know if you need help with the frontend or further backend enhancements!
