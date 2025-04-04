# Overengineered Todo API Server

A robust, scalable, and feature-rich REST API server for the Overengineered Todo application, built with Node.js, Express, and TypeScript following Clean Architecture principles.

## 🏗️ Architecture

This project follows Clean Architecture principles, with a clear separation of concerns:

```
src/
├── domain/           # Enterprise business rules, entities, value objects
├── application/      # Application business rules, use cases, ports
├── infrastructure/   # External concerns (database, external services)
├── presentation/     # Controllers, routes, middleware
├── common/           # Shared utilities, types, constants
└── swagger/          # API documentation
```

### Clean Architecture Layers

1. **Domain Layer** (`domain/`)
   - Business entities and rules
   - Repository interfaces
   - Domain events and types
   - Pure TypeScript with no external dependencies

2. **Application Layer** (`application/`)
   - Use cases implementation
   - Service interfaces
   - DTOs (Data Transfer Objects)
   - Business logic orchestration

3. **Infrastructure Layer** (`infrastructure/`)
   - Database implementations (TypeORM)
   - External services integration
   - Repository implementations
   - Logging, caching, etc.

4. **Presentation Layer** (`presentation/`)
   - Express controllers
   - Route definitions
   - Request/Response handling
   - Input validation


## 🚀 Features

- 📁 Collection Management (CRUD)
- ✅ Task Management with subtasks
- 📝 Data Validation
- 🗃️ MySQL Database with TypeORM
- 📊 Swagger API Documentation
- 🔍 Comprehensive Logging
- ✨ Clean Architecture Pattern
- 🧪 Unit Tests

## 🛠️ Technology Stack

### Core
- **Runtime**: Node.js
- **Language**: TypeScript
- **Framework**: Express.js
- **Database**: MySQL
- **ORM**: TypeORM

### Security
- **JWT**: jsonwebtoken
- **CORS**: cors

### Validation & Documentation
- **API Validation**: Joi
- **API Documentation**: Swagger (swagger-jsdoc, swagger-ui-express)

### Testing & Development
- **Testing Framework**: Mocha
- **Assertions**: Chai
- **Linting**: Biome

### Logging & Monitoring
- **Logging**: Winston
- **HTTP Logging**: Morgan

## 🚦 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- MySQL (v8.0 or higher)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd server
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env
   ```

   Configure the following variables in `.env` or modify those copied from .env.example if needed:
   ```env
   PORT=3000
   NODE_ENV=development
   
   # Database
   DB_HOST=localhost
   DB_PORT=3306
   DB_USERNAME=your_username
   DB_PASSWORD=your_password
   DB_DATABASE=todo_db
   
   # JWT
   JWT_SECRET=your_jwt_secret
   JWT_EXPIRATION=24h
   
   # Logging
   LOG_LEVEL=debug
   ```

4. Create database and run migrations:
   ```bash
   # Create database
   mysql -u root -p -e "CREATE DATABASE todo_db"
   
   # Optionally run migrations explicitly (not required as npm run dev will run them)
   npm run migration:run
   ```

### Development

Start the development server:
```bash
npm run dev
```

The API will be available at `http://localhost:3000`. Note that `npm run dev` will automatically run any pending migrations before starting the server.

### Building for Production

```bash
npm run build
```

## 📚 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run test` - Run tests
- `npm run lint:fix` - Run linter and fix issues
- `npm run migration:generate` - Generate new migration
- `npm run migration:run` - Run migrations
- `npm run migration:revert` - Revert last migration
- `npm run migration:show` - Show migration status

## 🗄️ Database Migrations

### Creating a New Migration

```bash
npm run migration:create src/infrastructure/database/migrations/MigrationName
```

### Generating Migration from Entity Changes

```bash
npm run migration:generate src/infrastructure/database/migrations/MigrationName
```

### Running Migrations

```bash
npm run migration:run
```

### Initial Collections

The database comes pre-seeded with 4 default collections:
- School
- Personal
- Design
- Groceries

These collections are automatically created when running the migrations. You can add, edit, or delete these collections as needed.

## 📝 API Documentation

Once the server is running, access the Swagger documentation at:
```
http://localhost:3000/api-docs
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📜 License

This project is licensed under the MIT License - see the LICENSE file for details.
