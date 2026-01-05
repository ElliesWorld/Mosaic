# Mosaic

A productivity web application with voice input, task management, shopping lists, calendar, and a memory bank.

## Features

- Task management with due dates
- Shopping list with automatic categorization
- Calendar
- Memory bank for quick notes
- Voice input support
- Real-time task synchronization

## Tech Stack

- React 18 with TypeScript
- Express.js backend
- PostgreSQL database with Prisma ORM
- TailwindCSS for styling
- Vite build tool
- Jest for testing
- Swagger for API documentation

## Prerequisites

- Node.js (v18 or higher)
- Docker Desktop (for PostgreSQL)
- Git

## Installation

### 1. Clone the repository

```bash
git clone https://github.com/yourusername/mosaic.git
cd mosaic
```

### 2. Install dependencies

```bash
npm install
```

### 3. Run database migrations

```bash
npx prisma migrate dev --name init
npx prisma generate
```

## Running the Application

### Development Mode

Run both frontend and backend simultaneously:

```bash
npm run dev:all
```

Or run them separately:

**Backend (Terminal 1):**
```bash
npm run dev:server
```

**Frontend (Terminal 2):**
```bash
npm run dev
```

### Access the Application

- Frontend: http://localhost:5173
- Backend API: http://localhost:3001
- API Documentation (Swagger): http://localhost:3001/api-docs
- Database Admin (Prisma Studio): `npm run prisma:studio`

## Testing

Run the test suite:

```bash
npm test
```

Run tests with coverage:

```bash
npm test -- --coverage
```

## API Endpoints

### Tasks

- `GET /api/tasks` - Get all tasks
- `GET /api/tasks/:id` - Get task by ID
- `POST /api/tasks` - Create a new task
- `PUT /api/tasks/:id` - Update a task
- `DELETE /api/tasks/:id` - Delete a task
- `PATCH /api/tasks/:id/toggle` - Toggle task completion

Full API documentation available at http://localhost:3001/api-docs when the server is running.

## Database Management

View and edit data using Prisma Studio:

```bash
npm run prisma:studio
```

Create a new migration after schema changes:

```bash
npm run prisma:migrate
```

Regenerate Prisma Client:

```bash
npm run prisma:generate
```