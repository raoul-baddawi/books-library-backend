## Project Overview
<!-- To be determined -->
TBD.

**This is the backend of the application**, where all the business logic and data processing will occur.

## Data Models

TBD.

**Unless asked to work on the database schema directly, you may use the `prisma/schema.prisma` file as a reference for the database structure.**

## Libraries and Frameworks

- NestJS + Fastify for building the backend API.
- Prisma for database interactions.
- PostgreSQL as the database management system.

## Folder Structure

- `/prisma`
  - `schema.prisma`: Defines the database schema and models.
- `/src`
  - `/api`: The backend API routes, including their controllers, services, DTOs, and entities.
  - `/config`: Configuration files and settings for the application, mainly the environment variables.
  - `/core`: Application wide utilities and shared decorators, interceptors, pipes, etc.
  - `/integrations`: External service integrations, such as payment gateways, messaging services, etc. This also contains Prisma client instantiation and configuration.
  - `/utils`: General utility functions and helpers for the application.
