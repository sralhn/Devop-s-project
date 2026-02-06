# Student Event Management Platform (POC)

A modern, containerized web application for managing student events, built to demonstrate DevOps best practices and secure application development.

## 🚀 Features

### Core Functionality
- **Discover Events**: Browse upcoming campus events in a visual, card-based interface.
- **Detailed Event View**: Access comprehensive event details including date, time, location, and real-time capacity.
- **User Registration**: Secure sign-up process with email verification and password complexity enforcement.
- **Event Registration**: One-click registration for events with automatic spot management.

### Advanced Features
- **Role-Based Access Control (RBAC)**:
  - **Participants**: Can register/unregister for events.
  - **Admins**: Can create/edit/delete events, manage users (block/unblock), and view all registrations.
- **Real-Time Notifications**:
  - **Registration Emails**: Immediate confirmation upon registering for an event.
  - **Update Notifications**: Detailed emails sent to participants and admins when an event is modified, highlighting specific changes (diffs).

### Security
- **Password Complexity**: Enforces strong passwords (min 8 chars, uppercase, lowercase, number, symbol) with real-time frontend validation and backend enforcement.
- **Email Verification**: Users must verify their email address before logging in (simulated via Mailtrap).
- **Protected Routes**: Secure API endpoints and frontend routes ensuring only authorized access.

## 🛠️ Technology Stack

### Frontend
- **Framework**: React 18
- **Build Tool**: Vite
- **Styling**: Tailwind CSS (custom design system)
- **Icons**: Lucide React
- **Routing**: React Router DOM

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database ORM**: Prisma
- **Email Service**: Nodemailer (configured with Mailtrap)
- **Validation**: Express Validator

### Infrastructure & DevOps
- **Containerization**: Docker & Docker Compose
- **Web Server**: Nginx (serving frontend)
- **Database**: SQLite (persisted via Docker volumes)
- **CI/CD**: GitHub Actions (automated testing and build checks)

## � Database Schema

The application uses a relational SQLite database managed by Prisma. Key models include:

- **User**: Stores user credentials, role (`USER`, `ADMIN`), and verification status.
- **Event**: Stores event details (title, description, date, location, capacity).
- **Registration**: Join table linking Users and Events, tracking registration timestamp.

## 🐳 Quick Start

**Prerequisites**: Docker & Docker Compose.

1.  **Clone the repository**
    ```bash
    git clone <repo-url>
    cd project
    ```

2.  **Configure Environment**
    Ensure `.env` files are present in `backend/` and `frontend/` (if applicable).
    *Note: For this POC, default values are provided.*

3.  **Run with Docker Compose**
    ```bash
    docker compose up --build
    ```

4.  **Access the Application**
    - **Frontend**: [http://localhost:8080](http://localhost:8080)
    - **Backend API**: [http://localhost:3000](http://localhost:3000)
    - **Mailtrap**: Access the Mailtrap inbox to view simulated emails.

## 🔄 Application Flow

1.  **Sign Up**: User creates an account. System sends a verification email.
2.  **Verify**: User clicks the link in the email (simulated) to activate the account.
3.  **Login**: User logs in with verified credentials.
4.  **Explore**: User browses events on the dashboard.
5.  **Register**: User registers for an event. Confirmation email is sent.
6.  **Admin Actions**: Admin users can access the dashboard to create new events or edit existing ones.
7.  **Updates**: When an admin updates an event, all registered participants receive an email detailing exactly what changed.

## 🔄 CI/CD Pipeline

This project uses **GitHub Actions** to insure code quality and security.
-   **Triggers**: Commits to `main` and `develop` branches.
-   **Jobs**:
    1.  **lint**: Checks code style and syntax for both frontend and backend using ESLint.
    2.  **security**: Scans dependencies for known vulnerabilities (`npm audit`).
    3.  **backend-test**: Runs unit tests for the backend API.
    4.  **frontend-build**: Verifies that the React application builds without errors.
    5.  **build-containers**: Builds Docker images for production deployment (only runs if all previous checks pass).

## 📦 Project Structure

```
.
├── backend/                # Express API
│   ├── src/
│   │   ├── auth.controller.js  # Auth logic (Login, Register, Verify)
│   │   ├── controllers.js      # Core business logic
│   │   ├── services/           # Email service
│   │   └── ...
│   ├── prisma/             # Database schema and migrations
│   └── Dockerfile
├── frontend/               # React Application
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Application views
│   │   └── ...
│   ├── nginx.conf          # Nginx configuration
│   └── Dockerfile
├── .github/workflows/      # CI/CD (GitHub Actions)
└── docker-compose.yml      # Container orchestration
```
