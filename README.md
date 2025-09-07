# 🚀 Project Setup & Running the System

## 📌 Overview

This project is a sample **monorepo** that shows you how to run a Next.js frontend and a FastAPI backend using **Docker Compose**. With a single command, you can start the entire system without worrying about local dependencies—everything runs inside containers.

---

## ⚡ Requirements

Before you get started, make sure you have the following installed:

- **Docker** (latest version recommended)
- **Docker Compose**

---

## 🐳 Running the System

### Starting the System

To start the system, simply run this command in your terminal:

```bash
docker compose up
```

This will automatically:

- Build and start all the containers defined in the `docker-compose.yml` file.
- Expose the backend (FastAPI) and frontend (Next.js) on the configured ports.

You should now be able to access the application in your web browser.

### Stopping the System

You have two easy ways to stop the running containers:

1.  Press `CTRL + C` in the terminal where `docker compose up` is running.

2.  Or, run this command in a new terminal:

    ```bash
    docker compose down
    ```

This command will stop and remove the containers, cleaning up your environment.
