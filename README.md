# GymFlow Web Project

This project is a SPA for managing a gym, developed for the **"Fondamenti del Web"** course (A.Y. 2025/2026) at **Politecnico di Bari**. It features a microservices-based backend and a React frontend.

## Architecture Overview

### Backend Microservices
The backend is split into multiple Node.js microservices, all routed through an **NGINX API Gateway**:
- **Auth Service**: Handles user authentication, registration, login, and JWT-based session management.
- **Gym Service**: Manages the core business logic of the gym, such as machines, exercises, and user progress.
- **Live Room Service**: Manages real-time features and live interactions (via WebSockets).

### Frontend
- **React SPA**: A modern Single Page Application built with **React**. It utilizes **Material UI** combined with **custom CSS** for styling, and **Axios** for handling HTTP requests to the backend.

## Prerequisites
Make sure you have the following installed on your machine:
- [Docker](https://www.docker.com/)
- [Docker Compose](https://docs.docker.com/compose/)

## Getting Started

1. **Configuration**: 
   Before starting the containers, make sure you configure your secrets. Replace the placeholders (like `<INSERT_MONGO_URI>`, `<INSERT_JWT_SECRET>`, etc.) in the `docker-compose.yaml` and `.env` files with your actual private keys and database connections.

2. **Run with Docker Compose**:
   To build the images and start the entire stack, run the following command in the root directory of the project:

   ```bash
   docker-compose up --build
   ```

   *To run it in the background, you can add the `-d` flag: `docker-compose up --build -d`*

3. **Access the Application**:
   Once all containers are up and running, you can access:
   - **Frontend UI**: [http://localhost:3000](http://localhost:3000)
   - **Backend API Gateway**: [http://localhost:5000](http://localhost:5000)

## Stopping the Project

To stop the containers and remove the networks created by Docker Compose, run:
```bash
docker-compose down
```

## Authors
- **Angelo F. Manfredi**
- **Gabriele G. Sannicandro**
