# Better Shoppy

Better Shoppy is a real-time collaborative shopping list application.

## Quick Start (Docker)

The easiest way to run the application is using Docker Compose.

### Prerequisites
- Docker & Docker Compose
- Bun (optional, for local development)

### 1. Configure Environment

Copy the example environment file:

```bash
cp .env.example .env
```

Edit `.env` if you need to change default credentials or ports.

```env
# Database Credentials
DB_ROOT_PASSWORD=rootpassword
DB_NAME=better_shoppy
DB_USER=shoppy_user
DB_PASSWORD=shoppy_password

# Authentication
JWT_SECRET=your_super_secret_jwt_key_here

# Ports
SERVER_PORT=8080   # Port where the frontend will be accessible
```

### 2. Run with Docker Compose

**Development Build (Local Source):**
```bash
docker-compose up -d --build
```

**Production Build (Pre-built Images):**
To use the official production images from GitHub Container Registry:
```bash
docker-compose -f docker-compose.prod.yml up -d
```

- **Frontend**: http://localhost:8080
- **Backend API**: http://localhost:4000/api
- **Database**: Port 3306 (internal)

### 3. Stop Services

```bash
docker-compose down
# To remove volumes (reset data):
# docker-compose down -v
```

## Development

If you want to run the frontend or backend locally without Docker, refer to their specific documentation:

- [Frontend Documentation](./frontend/README.md)
- [Backend Documentation](./backend/README.md)

## Architecture

- **Frontend**: React, Vite, Tailwind, Tanstack Query
- **Backend**: Node.js, Express, Socket.IO, Sequelize
- **Database**: MySQL 8.0

## CI/CD

This project uses GitHub Actions for CI/CD:
- **PR Check**: builds frontend/backend on pull requests.
- **Publish**: builds and pushes Docker images to GHCR on merge to `main` (prod) or `develop` (dev).


