# SprintFlow

**SprintFlow** is a lightweight project and issue tracking application designed for small teams. It helps teams manage projects, track issues, and prioritize work without the complexity of enterprise-level tools.

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [API Routes](#api-routes)
- [Database Schema](#database-schema)
- [Development](#development)
- [Deployment](#deployment)
- [CI/CD](#cicd)

## ✨ Features

### User Management
- User registration and authentication
- JWT-based secure session management
- Role-based access control (Admin/Member)
- Protected routes and API endpoints

### Project Management
- Create and manage projects
- Project descriptions and metadata
- Project ownership and member management
- View all projects you own or are a member of

### Issue Tracking
- Create, view, update, and delete issues
- Issue status workflow: `BACKLOG` → `IN_PROGRESS` → `REVIEW` → `DONE`
- Priority levels: `LOW`, `MEDIUM`, `HIGH`
- Issue assignment and due dates
- Real-time status updates

### User Interface
- Modern, responsive design with Tailwind CSS
- Dark theme optimized interface
- Intuitive dashboard navigation
- Clean and minimal UI focused on productivity

## 🛠 Tech Stack

### Frontend
- **Next.js 16** - React framework with App Router
- **React 19** - UI library
- **TypeScript** - Type-safe development
- **Tailwind CSS 4** - Utility-first CSS framework

### Backend
- **Next.js API Routes** - Serverless API endpoints
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT (jsonwebtoken)** - Authentication tokens
- **bcryptjs** - Password hashing

### Validation & Security
- **Zod** - Schema validation
- **HTTP-only cookies** - Secure token storage
- **Password hashing** - bcryptjs for secure password storage

## 📁 Project Structure

```
sprintflow/
├── src/
│   ├── app/                          # Next.js App Router
│   │   ├── (auth)/                   # Authentication routes (login, register)
│   │   │   ├── login/
│   │   │   └── register/
│   │   ├── api/                      # API Routes
│   │   │   ├── auth/                 # Authentication endpoints
│   │   │   │   ├── login/
│   │   │   │   ├── logout/
│   │   │   │   ├── me/
│   │   │   │   └── register/
│   │   │   ├── issues/               # Issue CRUD endpoints
│   │   │   │   └── [issueId]/
│   │   │   └── projects/             # Project CRUD endpoints
│   │   │       └── [projectId]/
│   │   ├── dashboard/                # Protected dashboard routes
│   │   │   ├── layout.tsx            # Dashboard layout with sidebar
│   │   │   ├── page.tsx              # Dashboard overview
│   │   │   └── projects/             # Project management pages
│   │   │       ├── [projectId]/
│   │   │       │   ├── page.tsx      # Project detail view
│   │   │       │   └── issues/       # Issue management
│   │   │       │       ├── [issueId]/page.tsx
│   │   │       │       └── new/page.tsx
│   │   │       └── new/              # Create new project
│   │   ├── globals.css               # Global styles
│   │   ├── layout.tsx                # Root layout
│   │   └── page.tsx                  # Landing page
│   ├── components/                   # Reusable React components
│   │   ├── Footer.tsx
│   │   ├── Header.tsx
│   │   ├── IssueCard.tsx
│   │   ├── LogoutButton.tsx
│   │   └── ProjectCard.tsx
│   ├── lib/                          # Utility libraries
│   │   ├── auth.ts                   # Authentication helpers (JWT, cookies)
│   │   ├── mongodb.ts                # MongoDB connection management
│   │   └── validation.ts             # Zod validation schemas
│   └── models/                       # Mongoose data models
│       ├── User.ts                   # User model (name, email, password, role)
│       ├── Project.ts                # Project model (name, description, owner, members)
│       └── Issue.ts                  # Issue model (title, description, status, priority)
├── public/                           # Static assets
├── .github/
│   └── workflows/                    # GitHub Actions CI/CD
│       └── ci.yml                    # Continuous Integration workflow
├── next.config.ts                    # Next.js configuration
├── tsconfig.json                     # TypeScript configuration
├── package.json                      # Dependencies and scripts
└── README.md                         # This file
```

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18.x or higher
- **MongoDB** database (local or cloud instance like MongoDB Atlas)
- **npm** or **yarn** package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd sprintflow
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Set up environment variables**
   
   Create a `.env.local` file in the root directory:
   ```env
   MONGODB_URI=mongodb://localhost:27017/sprintflow
   # or for MongoDB Atlas:
   # MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/sprintflow

   JWT_SECRET=your-super-secret-jwt-key-here-minimum-32-characters
   ```

4. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🔐 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `MONGODB_URI` | MongoDB connection string | Yes |
| `JWT_SECRET` | Secret key for JWT token signing | Yes |
| `NODE_ENV` | Environment mode (`development` or `production`) | Optional |

### Example `.env.local`

```env
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/sprintflow?retryWrites=true&w=majority
JWT_SECRET=your-very-secure-secret-key-minimum-32-characters-long
NODE_ENV=production
```

## 🔌 API Routes

### Authentication

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login and receive JWT token
- `POST /api/auth/logout` - Logout (clears auth cookie)
- `GET /api/auth/me` - Get current user information

### Projects

- `GET /api/projects` - Get all projects for the authenticated user
- `POST /api/projects` - Create a new project
- `GET /api/projects/[projectId]` - Get project details
- `PATCH /api/projects/[projectId]` - Update project
- `DELETE /api/projects/[projectId]` - Delete project

### Issues

- `GET /api/issues?projectId=<id>` - Get all issues for a project
- `POST /api/issues` - Create a new issue
- `GET /api/issues/[issueId]` - Get issue details
- `PATCH /api/issues/[issueId]` - Update issue
- `DELETE /api/issues/[issueId]` - Delete issue

## 🗄️ Database Schema

### User Model
```typescript
{
  name: string;
  email: string (unique);
  passwordHash: string;
  role: "ADMIN" | "MEMBER";
  createdAt: Date;
  updatedAt: Date;
}
```

### Project Model
```typescript
{
  name: string;
  description?: string;
  owner: ObjectId (ref: User);
  members: ObjectId[] (ref: User);
  createdAt: Date;
  updatedAt: Date;
}
```

### Issue Model
```typescript
{
  title: string;
  description?: string;
  status: "BACKLOG" | "IN_PROGRESS" | "REVIEW" | "DONE";
  priority: "LOW" | "MEDIUM" | "HIGH";
  project: ObjectId (ref: Project);
  reporter: ObjectId (ref: User);
  assignee?: ObjectId (ref: User);
  dueDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}
```

## 💻 Development

### Available Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm run start

# Run ESLint
npm run lint
```

### Code Structure Guidelines

- **Components**: Reusable UI components in `src/components/`
- **Pages**: Route pages in `src/app/` following Next.js App Router conventions
- **API Routes**: Server-side logic in `src/app/api/`
- **Models**: Database schemas in `src/models/`
- **Lib**: Utility functions and helpers in `src/lib/`

### Authentication Flow

1. User registers/logs in via `/api/auth/register` or `/api/auth/login`
2. Server creates JWT token and sets it as HTTP-only cookie
3. Protected routes use `getCurrentUser()` to verify token
4. Cookie is automatically sent with subsequent requests
5. Logout clears the cookie

## 🔄 CI/CD

The project includes GitHub Actions workflows for continuous integration:

- **Automated Testing**: Runs on every push and pull request
- **Build Verification**: Ensures the project builds successfully
- **Type Checking**: Validates TypeScript compilation
- **Linting**: Runs ESLint checks

See `.github/workflows/ci.yml` for the complete CI configuration.
---

**Built with ❤️ using Next.js and MongoDB**
