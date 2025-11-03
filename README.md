# Books Library Backend<p align="center">

<a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>

A robust RESTful API for managing books and users, built with NestJS, Prisma, PostgreSQL, and AWS S3.</p>

--- <p align="center">A template repo for nestjs bundled with typescript, eslint, and prettier.</p>

## 📋 Table of Contents## Setup

- [Setup Instructions](#setup-instructions)Please make sure you have the following installed:

- [Application Overview](#application-overview)

- [User Roles & Permissions](#user-roles--permissions)- [Node.js](https://nodejs.org/en/download/)

- [Application Flow](#application-flow)- [pnpm](https://pnpm.io/installation)

- [API Endpoints](#api-endpoints)

- [Environment Variables](#environment-variables)Install dependencies:

- [Development Scripts](#development-scripts)

- [Database Management](#database-management)```bash

- [Route Protection & Authorization](#route-protection--authorization)pnpm install

- [Code Quality](#code-quality)```

- [Architecture](#architecture)

#

---

## Run the app

## 🚀 Setup Instructions

````bash

### Prerequisites

- **Node.js** (v18 or higher) - *Not required if using Docker*
- **pnpm** (v8 or higher) - *Not required if using Docker*
- **Docker** and **Docker Compose** (optional, for containerized setup)
- **PostgreSQL** database - *Automatically set up with Docker*
- **AWS S3** bucket (for media storage)

## This template comes with the following:

- Eslint setup out of the box

- Prettier setup out of the box

### Installation Steps- Sentry integration

- [nestjs-zod](https://github.com/BenLorantfy/nestjs-zod) and [zod](https://github.com/colinhacks/zod) for DTO validation and response mapping

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd books-library-backend
````

2. **Install dependencies**

   ```bash
   pnpm install
   ```

3. **Create the `generated` folder**

   This folder is required for Prisma client generation:

   ```bash
   mkdir generated
   ```

   > Note: This folder is already created and tracked with a `.gitkeep` file.

4. **Configure environment variables**

   Create a `.env` file in the root directory with the following variables (see [Environment Variables](#environment-variables) for details):

   ```env
   # Application Configuration
   PORT=8080
   NODE_ENV="development"
   APP_NAME="books-library-backend"

   # Database Configuration
   DATABASE_URL="postgresql://username:password@localhost:5432/books_library?schema=public"

   # JWT Configuration
   JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
   ALLOWED_ORIGINS=["http://localhost:3000"]

   # S3 Configuration for Media Storage
   S3_ACCESS_KEY_ID="your-aws-access-key-id"
   S3_ACCESS_KEY_SECRET="your-aws-secret-access-key"
   S3_REGION="your-s3-region"
   S3_SIGNATURE_VERSION="v4"
   S3_BUCKET="your-s3-bucket-name"
   S3_BASE_URL="https://your-bucket.s3.your-region.amazonaws.com"
   ```

5. **Generate Prisma Client**

   ```bash
   pnpm generate
   ```

   This creates the Prisma client in the `generated/prisma/client` folder.

   > ⚠️ **Note**: The ERD generation in `prisma/schema.prisma` is commented out by default. Only uncomment it if you're working in a development environment, as it will cause Docker production builds to fail.

6. **Run database migrations**

   ```bash
   pnpm db:migrate
   ```

   This applies all pending migrations to your database.

7. **Seed the database (optional)**

   ```bash
   pnpm db:seed
   ```

   This populates your database with sample users and books for development.

8. **Start the development server**

   **Option A: Using Docker (Recommended)**

   ```bash
   docker-compose up --build
   ```

   This will run the application in a dockerized container. The API will be available at `http://localhost:8080`

   **Option B: Using Node.js directly**

   ```bash
   pnpm start:dev
   ```

   This starts the development server with hot reload. The API will be available at `http://localhost:8080`

9. **Access the API documentation**

   Open your browser and navigate to:

   ```
   http://localhost:8080/docs
   ```

   This provides an interactive Swagger UI for testing all API endpoints.

---

## � Docker Setup

If you prefer running the application in a containerized environment, Docker provides an isolated and consistent setup.

### Prerequisites

- **Docker** and **Docker Compose** installed on your machine

### Quick Start with Docker

1. **Configure environment variables**

   Create a `.env` file in the root directory (see [Environment Variables](#environment-variables) for required variables).

2. **Build and start the containers**

   ```bash
   docker-compose up --build
   ```

   This command will:
   - Build the Docker image for the application
   - Start the PostgreSQL database container
   - Start the application container
   - Run database migrations automatically
   - Start the NestJS application

3. **Access the application**

   The API will be running on `http://localhost:8080`

   Access the Swagger documentation at `http://localhost:8080/docs`

### Docker Commands

| Command                      | Description                           |
| ---------------------------- | ------------------------------------- |
| `docker-compose up --build`  | Build and start all containers        |
| `docker-compose up`          | Start containers (without rebuilding) |
| `docker-compose down`        | Stop and remove containers            |
| `docker-compose down -v`     | Stop containers and remove volumes    |
| `docker-compose logs -f`     | View logs from all containers         |
| `docker-compose logs -f app` | View logs from the app container only |
| `docker-compose exec app sh` | Access shell inside the app container |
| `docker-compose restart`     | Restart all containers                |

### Docker Notes

- The PostgreSQL database runs in a separate container and persists data using Docker volumes
- The application automatically runs migrations on startup
- Hot reload is enabled in development mode when using Docker
- To rebuild after dependency changes, use `docker-compose up --build`

---

## �📖 Application Overview

The Books Library Backend is a full-featured RESTful API that provides:

- **User authentication & authorization** - JWT-based auth with role-based access control
- **Book management** - Complete CRUD operations with soft deletion
- **User management** - Admin-controlled user administration
- **Media upload** - AWS S3 integration for book cover images
- **Advanced filtering** - Search, filter, and paginate resources
- **Database seeding** - Quick setup with sample data
- **API documentation** - Auto-generated Swagger UI
- **Security** - Cookie-based JWT tokens, CORS protection, rate limiting
- **Type safety** - End-to-end TypeScript with Prisma and Zod

---

## 👥 User Roles & Permissions

The API supports **two user roles** with distinct permissions:

### 1. **ADMIN**

**Full system access**

- ✅ View all books
- ✅ Create new books
- ✅ Edit any book
- ✅ Delete any book
- ✅ View all users
- ✅ Create new users
- ✅ Edit any user
- ✅ Delete users (except other admins)
- ✅ Access all protected endpoints

### 2. **AUTHOR**

**Limited to book management**

- ✅ View all books
- ✅ Create new books
- ✅ Edit their own books
- ✅ Delete their own books
- ❌ Cannot access user management endpoints
- ❌ Cannot edit/delete books created by others

---

## 🔄 Application Flow

### Authentication Flow

1. **Registration** (`POST /api/auth/register`)
   - Users create an account with email, password, and personal details
   - Password is hashed using Argon2
   - Default role is `AUTHOR`
   - JWT token is returned in a secure HTTP-only cookie

2. **Login** (`POST /api/auth/login`)
   - Users authenticate with email and password
   - JWT token is issued and stored in HTTP-only cookie
   - Token includes user ID and role

3. **Protected Requests**
   - Client sends requests with JWT cookie
   - `JwtGuard` validates token globally on all routes (unless marked `@Public()`)
   - User data is extracted and attached to request
   - `RolesGuard` checks if user has required role (when `@AllowedRoles()` is used)

4. **Logout** (`POST /api/auth/logout`)
   - Clears the authentication cookie
   - No server-side session invalidation (stateless JWT)

### Book Management Flow

1. **Public Book Browsing** (`GET /api/books`)
   - Anyone can view published books
   - Supports pagination, search, and genre filtering
   - Returns transformed book data with author information

2. **Admin Book Management** (`POST /api/books/get-all`)
   - Admins and authors see all books (including unpublished)
   - Authors can filter by their own books
   - Includes advanced filtering and sorting

3. **Creating Books** (`POST /api/books`)
   - Authenticated users (ADMIN/AUTHOR) can create books
   - Media URLs from S3 are stored in the `media` array
   - Book is associated with the creating user as author

4. **Updating Books** (`PATCH /api/books/:id`)
   - Authors can update their own books
   - Admins can update any book
   - Authorization check prevents unauthorized edits

5. **Deleting Books** (`POST /api/books/delete/:id`)
   - Soft deletion (sets `deletedAt` timestamp)
   - Authors can delete their own books
   - Admins can delete any book

### User Management Flow (Admin Only)

1. **View Users** (`POST /api/users/get-all`)
   - Admins can view all users
   - Supports pagination and filtering
   - Current user is excluded from their own results

2. **Create User** (`POST /api/users`)
   - Admins can create users with any role
   - Password is hashed before storage

3. **Update User** (`PATCH /api/users/:id`)
   - Admins can update user details
   - Can change role, name, email, etc.

4. **Delete User** (`POST /api/users/delete/:id`)
   - Admins can delete users
   - Cannot delete other admin accounts (business logic)

### Media Upload Flow

1. **Request Upload URL** (`POST /api/media/get-upload-url`)
   - Client requests a pre-signed S3 upload URL
   - Specifies file extension and path
   - Returns temporary upload URL (expires in 15 minutes)

2. **Upload to S3**
   - Client uploads file directly to S3 using pre-signed URL
   - No server resources used for file transfer

3. **Store Media URL**
   - Client includes S3 URL when creating/updating books
   - URLs are stored in the `media` array field

4. **Delete Media** (`POST /api/media/delete-file`)
   - Client can request deletion of S3 objects
   - Removes files from bucket

---

## 🗺️ API Endpoints

### Authentication Endpoints

| Method | Endpoint             | Access | Description                |
| ------ | -------------------- | ------ | -------------------------- |
| POST   | `/api/auth/login`    | Public | Login with email/password  |
| POST   | `/api/auth/register` | Public | Create new user account    |
| GET    | `/api/auth/me`       | Auth   | Get current user data      |
| POST   | `/api/auth/logout`   | Auth   | Clear authentication token |

### Book Endpoints

| Method | Endpoint                   | Access       | Description                     |
| ------ | -------------------------- | ------------ | ------------------------------- |
| GET    | `/api/books`               | Public       | Get published books (paginated) |
| GET    | `/api/books/:id`           | Public       | Get book by ID                  |
| GET    | `/api/books/genre-options` | Public       | Get available genre options     |
| POST   | `/api/books/get-all`       | Admin/Author | Get all books (admin view)      |
| POST   | `/api/books`               | Admin/Author | Create new book                 |
| PATCH  | `/api/books/:id`           | Admin/Author | Update book (own or any)        |
| DELETE | `/api/books/delete/:id`    | Admin/Author | Soft delete book                |

### User Endpoints

| Method | Endpoint                    | Access | Description               |
| ------ | --------------------------- | ------ | ------------------------- |
| GET    | `/api/users/select-options` | Public | Get authors for dropdown  |
| POST   | `/api/users/get-all`        | Admin  | Get all users (paginated) |
| GET    | `/api/users/:id`            | Public | Get user by ID            |
| POST   | `/api/users`                | Admin  | Create new user           |
| PATCH  | `/api/users/:id`            | Admin  | Update user               |
| DELETE | `/api/users/delete/:id`     | Admin  | Delete user               |

### Media Endpoints

| Method | Endpoint                           | Access | Description                  |
| ------ | ---------------------------------- | ------ | ---------------------------- |
| POST   | `/api/media/get-upload-url`        | Public | Get S3 pre-signed upload URL |
| POST   | `/api/media/get-multi-upload-urls` | Public | Get multiple upload URLs     |
| POST   | `/api/media/delete-file`           | Public | Delete file from S3          |

---

## 🔐 Environment Variables

The application requires the following environment variables:

| Variable               | Required | Description                       | Example                                               |
| ---------------------- | -------- | --------------------------------- | ----------------------------------------------------- |
| `PORT`                 | Yes      | Server port number                | `8080`                                                |
| `NODE_ENV`             | Yes      | Environment mode                  | `development` or `production`                         |
| `APP_NAME`             | No       | Application name                  | `books-library-backend`                               |
| `DATABASE_URL`         | Yes      | PostgreSQL connection string      | `postgresql://user:pass@localhost:5432/books_library` |
| `JWT_SECRET`           | Yes      | Secret key for JWT signing        | Long random string (min 32 chars)                     |
| `ALLOWED_ORIGINS`      | Yes      | CORS allowed origins (JSON array) | `["http://localhost:3000"]`                           |
| `S3_ACCESS_KEY_ID`     | Yes      | AWS access key ID                 | Your AWS access key                                   |
| `S3_ACCESS_KEY_SECRET` | Yes      | AWS secret access key             | Your AWS secret key                                   |
| `S3_REGION`            | Yes      | AWS S3 bucket region              | `us-east-1`, `eu-north-1`, etc.                       |
| `S3_SIGNATURE_VERSION` | Yes      | S3 signature version              | `v4`                                                  |
| `S3_BUCKET`            | Yes      | S3 bucket name                    | `books-library-media`                                 |
| `S3_BASE_URL`          | Yes      | Base URL for S3 bucket            | `https://bucket-name.s3.region.amazonaws.com`         |

⚠️ **Security Notes:**

- **Never commit `.env` file to version control**
- Use strong, randomly generated `JWT_SECRET` (minimum 32 characters)
- Rotate AWS credentials regularly
- Use environment-specific values for production
- Keep `ALLOWED_ORIGINS` restrictive in production

---

## 🛠️ Development Scripts

| Command            | Description                                       |
| ------------------ | ------------------------------------------------- |
| `pnpm start:dev`   | Start development server with hot reload          |
| `pnpm start:debug` | Start in debug mode with inspector                |
| `pnpm build`       | Build for production                              |
| `pnpm start:prod`  | Run production build                              |
| `pnpm type:check`  | Run TypeScript type checking                      |
| `pnpm lint`        | Lint and auto-fix code with ESLint                |
| `pnpm format`      | Format code with Prettier                         |
| `pnpm pre-commit`  | Run all quality checks (type-check, lint, format) |
| `pnpm test`        | Run unit tests with Jest                          |
| `pnpm test:watch`  | Run tests in watch mode                           |
| `pnpm test:cov`    | Run tests with coverage report                    |
| `pnpm test:e2e`    | Run end-to-end tests                              |

---

## 🗄️ Database Management

### Prisma Scripts

| Command           | Description                                             |
| ----------------- | ------------------------------------------------------- |
| `pnpm generate`   | Generate Prisma Client (required after schema changes)  |
| `pnpm db:push`    | Push schema changes to DB without migrations (dev only) |
| `pnpm db:migrate` | Create and apply migration (production-ready)           |
| `pnpm db:reset`   | Reset database and rerun all migrations                 |
| `pnpm db:seed`    | Seed database with sample data                          |
| `pnpm studio`     | Open Prisma Studio (database GUI)                       |

### Database Seeding

The project includes a comprehensive seeding system:

**Seed the database:**

```bash
pnpm db:seed
```

This command:

1. Seeds 50 users (mix of ADMIN and AUTHOR roles)
2. Seeds books and assigns them to random authors
3. Uses Faker.js for realistic data

**Seed with database reset:**

```bash
pnpm db:seed --clear
```

This will:

1. Drop all tables
2. Rerun all migrations
3. Seed fresh data

**Seed files location:**

- Main seed: `prisma/seed.ts`
- User seeder: `prisma/seeds/users.ts`
- Book seeder: `prisma/seeds/books.ts`

**What gets seeded:**

- **Users**: 50 users with random names, emails, and roles
- **Books**: Books with titles, descriptions, genres, and media URLs
- All passwords are hashed with Argon2

### Migration Workflow

**Create a migration after schema changes:**

```bash
pnpm db:migrate
```

This will:

1. Prompt for a migration name
2. Create SQL migration files in `prisma/migrations/`
3. Apply the migration to your database
4. Regenerate Prisma Client

**Existing migrations:**

- `20251028115802_book_and_user_models_basic_setup` - Initial models
- `20251028125417_book_soft_deletion` - Added soft delete
- `20251030085537_added_genre_to_book_model` - Added genre field
- `20251030211636_cascading_books_on_user_deletion` - Cascade deletes
- `20251031084001_removed_user_enum_from_user_role_enums` - Role refactor

### Database Schema

**User Model:**

- `id` - Auto-increment primary key
- `email` - Unique email address
- `password` - Hashed with Argon2
- `firstName`, `lastName` - User's name
- `role` - `ADMIN` or `AUTHOR`
- `createdAt`, `updatedAt` - Timestamps
- `books` - Relation to books authored

**Book Model:**

- `id` - Auto-increment primary key
- `name` - Book title
- `description` - Book description
- `genre` - Book genre/category
- `media` - Array of S3 URLs for covers
- `isPublished` - Publication status
- `publishedAt` - Publication date
- `authorId` - Foreign key to User
- `author` - Relation to User
- `deletedAt` - Soft delete timestamp
- `createdAt`, `updatedAt` - Timestamps

---

## 🔒 Route Protection & Authorization

### How It Works

The application uses a **two-layer security system**:

#### 1. **Global JWT Authentication** (`JwtGuard`)

- Applied to **all routes by default**
- Validates JWT token from HTTP-only cookie
- Extracts user data and attaches to request
- Can be bypassed with `@Public()` decorator

#### 2. **Role-Based Authorization** (`RolesGuard`)

- Applied only to routes with `@AllowedRoles()` decorator
- Checks if authenticated user has required role
- Returns 403 Forbidden if role doesn't match

### Decorators

**`@Public()`**

- Marks route as publicly accessible
- Skips JWT authentication
- Used for login, register, and public book listing

Example:

```typescript
@Get('books')
@Public()
async getBooks() {
  // Anyone can access
}
```

**`@AllowedRoles(...roles)`**

- Enforces role-based access
- Requires JWT authentication first
- Checks if user has one of the specified roles

Example:

```typescript
@Post('users')
@AllowedRoles(UserRoleEnum.ADMIN)
async createUser() {
  // Only admins can access
}
```

**`@AuthUser()`**

- Parameter decorator to inject current user
- Only works on authenticated routes
- Returns full User object from database

Example:

```typescript
@Get('me')
async getMe(@AuthUser() user: User) {
  return user; // Current authenticated user
}
```

### Example Authorization Patterns

**Public route (no auth required):**

```typescript
@Get('books')
@Public()
async getBooks() {
  // No authentication needed
}
```

**Authenticated route (any logged-in user):**

```typescript
@Get('me')
async getProfile(@AuthUser() user: User) {
  // Must be logged in, any role
}
```

**Role-restricted route (specific roles only):**

```typescript
@Post('users')
@AllowedRoles(UserRoleEnum.ADMIN)
async createUser() {
  // Only ADMIN role allowed
}
```

**Multi-role route (multiple allowed roles):**

```typescript
@Post('books')
@AllowedRoles(UserRoleEnum.ADMIN, UserRoleEnum.AUTHOR)
async createBook(@AuthUser() user: User) {
  // ADMIN or AUTHOR allowed
}
```

### Authorization Flow

1. **Request arrives** → `JwtGuard` checks for `@Public()` decorator
2. **If not public** → Validate JWT from cookie
3. **If invalid token** → Return 401 Unauthorized
4. **If valid** → Attach user to request
5. **If `@AllowedRoles()` present** → `RolesGuard` checks user role
6. **If role doesn't match** → Return 403 Forbidden
7. **If authorized** → Execute route handler

### Common HTTP Status Codes

- **200 OK** - Successful request
- **201 Created** - Resource created successfully
- **400 Bad Request** - Validation error
- **401 Unauthorized** - Missing or invalid token
- **403 Forbidden** - Valid token but insufficient permissions
- **404 Not Found** - Resource not found
- **500 Internal Server Error** - Server error

---

## ✨ Code Quality

This project maintains high code quality standards:

### Pre-commit Hook

The `pre-commit` script runs before every commit:

```bash
pnpm pre-commit
```

This command:

1. **Type checks** all TypeScript files
2. **Lints** code with ESLint (auto-fixes issues)
3. **Formats** code with Prettier

All checks must pass before the commit is allowed.

### Code Quality Tools

- **TypeScript** - Static type checking
- **ESLint** - Code linting with NestJS rules
- **Prettier** - Code formatting
- **Zod** - Runtime schema validation
- **Jest** - Unit and E2E testing
- **Husky** - Git hooks for quality checks

### Validation & Error Handling

- **DTO Validation** - Uses Zod schemas for request validation
- **Custom Pipes** - `CustomZodValidationPipe` for detailed errors
- **Transform Interceptors** - Standardized response format
- **Exception Filters** - Global error handling

---

## 🏗️ Architecture

### Tech Stack

- **NestJS** - Progressive Node.js framework
- **TypeScript** - Type-safe development
- **Prisma** - Type-safe ORM with migrations
- **PostgreSQL** - Relational database
- **Passport JWT** - Authentication strategy
- **Argon2** - Password hashing
- **AWS S3** - Media storage
- **Zod** - Schema validation
- **Swagger** - API documentation
- **Cookie-parser** - Cookie handling
- **Sentry** - Error monitoring (production)

### Project Structure

```
src/
├── api/                    # Feature modules
│   ├── auth/              # Authentication & authorization
│   │   ├── decorators/   # Custom decorators (@Public, @AllowedRoles, @AuthUser)
│   │   ├── dto/          # Auth DTOs (login, register)
│   │   ├── guard/        # Guards (JwtGuard, RolesGuard)
│   │   └── strategy/     # Passport strategies
│   ├── books/            # Book management
│   │   ├── dto/          # Book DTOs (create, update, find)
│   │   ├── entities/     # Response transformers
│   │   └── *.service.ts  # Business logic
│   ├── users/            # User management
│   └── media/            # S3 media handling
├── config/               # Configuration schemas
├── core/                 # Core utilities
│   ├── decorators/      # Response transformers
│   ├── interceptors/    # Global interceptors
│   └── pipes/           # Validation pipes
├── integrations/        # Third-party integrations
│   └── prisma/         # Prisma service
└── utils/              # Shared utilities

prisma/
├── schema.prisma       # Database schema
├── seed.ts            # Main seed file
├── seeds/             # Individual seeders
├── migrations/        # Migration history
└── generated/         # Generated ERD diagrams

generated/
└── prisma/
    └── client/        # Auto-generated Prisma Client
```

### Design Patterns

- **Dependency Injection** - NestJS IoC container
- **Repository Pattern** - Prisma as data layer
- **Strategy Pattern** - Passport authentication strategies
- **Decorator Pattern** - Custom route decorators
- **Guard Pattern** - Authorization guards
- **DTO Pattern** - Data transfer objects with validation
- **Transformer Pattern** - Response data transformation

---

## 📚 Additional Resources

### API Documentation

Access the interactive Swagger documentation:

```
http://localhost:8080/docs
```

### Database GUI

Open Prisma Studio to view and edit data:

```bash
pnpm studio
```

### Prisma Schema Visualization

Generate ERD diagram:

```bash
pnpm generate
```

The ERD is saved to `prisma/generated/erd.svg`

---

## 🐛 Troubleshooting

### Common Issues

**Issue: Database connection fails**

- Verify `DATABASE_URL` in `.env`
- Ensure PostgreSQL is running
- Check database credentials and port

**Issue: Prisma Client not found**

- Run `pnpm generate` to create client
- Ensure `generated` folder exists
- Restart TypeScript server in VS Code

**Issue: Migrations fail**

- Check database connection
- Ensure no manual schema changes
- Try `pnpm db:reset` (⚠️ clears data)

**Issue: JWT authentication fails**

- Verify `JWT_SECRET` is set
- Check cookie settings match frontend
- Ensure `ALLOWED_ORIGINS` includes frontend URL

**Issue: S3 uploads fail**

- Verify AWS credentials in `.env`
- Check S3 bucket permissions
- Ensure bucket CORS is configured
- Verify bucket region matches `S3_REGION`

**Issue: Port already in use**

- Change `PORT` in `.env`
- Kill process using port: `npx kill-port 8080`

---

## 🤝 Contributing

When contributing to this project:

1. Ensure all environment variables are configured
2. Run `pnpm generate` after schema changes
3. Run `pnpm db:migrate` to create migrations
4. Run `pnpm pre-commit` before committing
5. Write tests for new features
6. Update API documentation (Swagger decorators)
7. Follow existing code structure and patterns

---

## 📄 License

UNLICENSED - Private project

---

**Built with ❤️ using NestJS and modern TypeScript tools by Raoul Baddawi**
