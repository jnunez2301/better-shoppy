# Better Shoppy

Better Shoppy is a real-time collaborative shopping list application.

## Quick Start (Docker)

The easiest way to run the application is using Docker Compose.

### Prerequisites
- Docker & Docker Compose **OR** Podman & Podman Compose
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

**For Podman Users:**

Add the following to your `.env` file to use Podman socket:

```env
# Container Runtime Socket (for Podman)
CONTAINER_SOCK=/run/podman/podman.sock

# Optional: MySQL and Traefik Dashboard ports (dev only)
MYSQL_PORT=3306
TRAEFIK_DASHBOARD_PORT=8090
```

### 2. Run with Docker Compose

**Development Build (Local Source):**
```bash
# Docker
docker-compose up -d --build

# Podman
podman-compose up -d --build
```

**Production Build (Pre-built Images):**
To use the official production images from GitHub Container Registry:
```bash
# Docker
docker-compose -f docker-compose.prod.yml up -d

# Podman
podman-compose -f docker-compose.prod.yml up -d
```

**Access the application:**
- **Frontend**: http://localhost:8080 (or your `SERVER_PORT`)
- **Backend API**: http://localhost:8080/api (routed through Traefik)
- **Traefik Dashboard** (dev only): http://localhost:8090

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

## Mobile Development (Android)

This project uses **Capacitor** to wrap the web application for Android devices.

### Prerequisites
- Android Studio
- Bun (or npm/yarn/pnpm)

### Setup & Running on Android

1.  **Install Dependencies**:
    ```bash
    cd frontend
    bun install
    ```

2.  **Configure API URL**:
    Create or update your `frontend/.env` file. For Android emulator or device testing, `localhost` won't work. Use your computer's local IP address.
    ```env
    VITE_API_URL=http://<YOUR_LOCAL_IP>:4000
    ```
    *Note: If using the Android Emulator, `http://10.0.2.2:4000` is the alias for the host machine's localhost.*

3.  **Build and Run**:
    Use the helper script to build the frontend, sync with Capacitor, and open Android Studio:
    ```bash
    bun run build:android
    ```

4.  **Other Commands**:
    - `bun run cap:sync`: Sync web assets and plugins to the native platform.
    - `bun run cap:copy`: Copy web assets to the native platform.
    - `bun run cap:open:android`: Open the Android project in Android Studio.
5. **Build and Run**:
    ```bash
    # On Android Studio
    ./android/gradlew assembleDebug
    ```
## Architecture

- **Frontend**: React, Vite, Tailwind, Tanstack Query
- **Mobile**: Capacitor (Android)
- **Backend**: Node.js, Express, Socket.IO, Sequelize
- **Database**: MySQL 8.0

## CI/CD

This project uses GitHub Actions for CI/CD:
- **PR Check**: builds frontend/backend on pull requests.
- **Publish**: builds and pushes Docker images to GHCR on merge to `main` (prod) or `develop` (dev).


