# Task Management System

A full-stack task management application built as part of the Software Engineering Assessment (Track A: Full-Stack Engineer). This project demonstrates secure authentication, CRUD operations, and modern web development practices using Next.js and Node.js.

## Project Overview

This Task Management System allows users to register, log in, and perform complete management of their personal tasks. The application features:

- **Secure Authentication**: JWT-based authentication with access and refresh tokens

- **Task Management**: CRUD operations with optimistic updates

- **Responsive Design**: Design that works seamlessly across all devices

- **Advanced Filtering**: Search, filter by status, and sort tasks

- **Professional UI**: Built with Material-UI for a polished user experience

## Technology Stack

### Frontend (Client)

- **Framework**: Next.js 16 (App Router)

- **Language**: TypeScript

- **UI Library**: Material-UI (MUI) v7

- **State Management**: React Context API

- **Form Handling**: Formik + Yup

- **HTTP Client**: Axios

### Backend (Server)

- **Runtime**: Node.js

- **Framework**: Express.js

- **Language**: TypeScript

- **Database**: PostgreSQL

- **ORM**: Prisma

- **Authentication**: JWT

- **Password Hashing**: bcrypt

- **Validation**: Zod

## Installation & Setup

### Prerequisites

- Node.js

- npm or yarn

- PostgreSQL

### 1. Clone the Repository

```bash
git  clone https://github.com/ysam020/task-management-assignment
cd  task-management-system
```

### 2. Backend Setup

```bash
cd  server

# Install dependencies
npm  install

# Set up environment variables
touch .env
DATABASE_URL
JWT_ACCESS_SECRET
JWT_REFRESH_SECRET
JWT_ACCESS_EXPIRY
JWT_REFRESH_EXPIRY
PORT
NODE_ENV
CORS_ORIGIN

# Generate Prisma client
npm  run  prisma:generate

# Run database migrations
npm  run  prisma:migrate

# Seed the database
npm  run  seed

# Start the development server
npm  run  dev
```

The backend API will be available at `http://localhost:9000`

### 3. Frontend Setup

```bash
cd  client

# Install dependencies
npm  install

# Set up environment variables

cp  .env.local.example  .env.local

# Edit .env and configure:
NEXT_PUBLIC_API_URL=http://localhost:5000/api

# Start the development server
npm  run  dev
```

The frontend application will be available at `http://localhost:3000`

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register a new user

- `POST /api/auth/login` - Login with email and password

- `POST /api/auth/refresh` - Refresh access token

- `POST /api/auth/logout` - Logout and invalidate refresh token

### Tasks (Protected Routes)

- `GET /api/tasks` - Get all tasks (with pagination, filtering, searching)

- Query params: `page`, `limit`, `status`, `search`, `sortBy`, `sortOrder`

- `POST /api/tasks` - Create a new task

- `GET /api/tasks/:id` - Get a specific task

- `PATCH /api/tasks/:id` - Update a task

- `DELETE /api/tasks/:id` - Delete a task

- `PATCH /api/tasks/:id/toggle` - Toggle task status

## Features Implementation

### Part 1: Backend API

#### User Security (Authentication)

- [x] User registration with email and password

- [x] Login with JWT-based authentication

- [x] Access tokens (short-lived, 15 minutes)

- [x] Refresh tokens (long-lived, 7 days)

- [x] Password hashing using bcrypt

- [x] Logout functionality with token invalidation

- [x] Protected routes with authentication middleware

#### Task Management (CRUD)

- [x] Create tasks with title, description, and status

- [x] Read tasks with pagination support

- [x] Update task details

- [x] Delete tasks

- [x] Toggle task status (PENDING ↔ IN_PROGRESS ↔ COMPLETED)

- [x] Filter tasks by status

- [x] Search tasks by title

- [x] Sort tasks by date or title

- [x] User-specific task isolation

#### Technical Requirements

- [x] Full TypeScript implementation

- [x] Prisma ORM for database operations

- [x] Input validation with Zod

- [x] Error handling with proper HTTP status codes

- [x] Clean code architecture with separation of concerns

### Part 2: Web Frontend (Next.js + TypeScript)

#### Authentication

- [x] Login page with form validation

- [x] Registration page with password requirements

- [x] Automatic token refresh mechanism

- [x] Protected routes with authentication checks

- [x] Logout functionality

#### Task Dashboard

- [x] Task list with pagination

- [x] Real-time task updates

- [x] Filter by status (All, Pending, In Progress, Completed)

- [x] Search by task title

- [x] Sort by creation date, update date, or title

- [x] Responsive layout

- [x] Empty state handling

#### CRUD Functionality

- [x] Add new tasks with modal dialog

- [x] Edit existing tasks

- [x] Delete tasks with confirmation

- [x] Toggle task status with quick actions

- [x] Toast notifications for all operations

- [x] Form validation with error messages

- [x] Loading states and optimistic updates

#### Additional Features

- [x] Recent Activity sidebar tracking all changes

- [x] Left sidebar for filtering and navigation

- [x] Professional UI with Material-UI components

- [x] Responsive design

- [x] Error handling and user feedback

- [x] TypeScript throughout for type safety

## User Interface

The application features a modern, three-column layout:

1.  **Left Sidebar**: Navigation and filtering options

- Filter by status

- View all tasks

- Quick statistics

2.  **Main Content Area**: Task list and management

- Task cards with status badges

- Search and sort controls

- Add task button

- Pagination controls

3.  **Right Sidebar**: Recent Activity

- Real-time activity feed

- Task creation, updates, and deletions

- Status change tracking

- Timestamp for each activity

## Security Features

- **Password Security**: Bcrypt hashing with salt rounds

- **JWT Authentication**: Separate access and refresh tokens

- **Token Rotation**: Automatic refresh token rotation

- **Input Validation**: Server-side and client-side validation

- **SQL Injection Protection**: Prisma ORM with prepared statements

- **CORS Configuration**: Controlled cross-origin access

- **Environment Variables**: Sensitive data in environment files

## Development Scripts

### Backend

- `npm run dev` - Start development server with hot reload

- `npm run build` - Compile TypeScript to JavaScript

- `npm start` - Run production server

- `npm run prisma:generate` - Generate Prisma client

- `npm run prisma:migrate` - Run database migrations

- `npm run seed` - Seed database with sample data

### Frontend

- `npm run dev` - Start Next.js development server

- `npm run build` - Create production build

- `npm start` - Run production build

## Author

Sameer - Software Engineering Assessment Submission
