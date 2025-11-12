# Babyfoot Manager

This project is a web application for managing babyfoot (foosball) games, featuring a Node.js backend with Express and WebSockets, and a PostgreSQL database. The frontend is built with plain HTML, CSS, and JavaScript.

## Features

- **Game Management:** Create, track, and manage babyfoot games.
- **Real-time Updates:** WebSockets for real-time communication (e.g., game state updates).
- **RESTful API:** Backend API for game-related operations.
- **PostgreSQL Database:** Persistent storage for game data.

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js:** (LTS version recommended)
- **npm** or **Yarn:** Package manager for Node.js.
- **Docker** and **Docker Compose:** For running the PostgreSQL database.

## Getting Started

Follow these steps to set up and run the project locally.

### 1. Clone the Repository

```bash
git clone https://github.com/sami561/babyfoot-manager.git
cd babyfoot-manager
```

### 2. Backend Setup

Navigate to the `backend` directory and install dependencies:

```bash
cd backend
yarn install
```

### 3. Environment Variables

Create a `.env` file in the `backend` directory based on `.env.exemple`.
At a minimum, you'll need to configure your database connection.

Example `.env` file:

```
DATABASE_URL=postgres://postgres:postgres@localhost:5432/babyfoot
PORT=3000
```

### 4. Database Setup

The project uses PostgreSQL. You can run the database using Docker Compose:

```bash
docker-compose up -d db
```

This will start a PostgreSQL container in the background.

### 5. Run the Backend

From the `backend` directory, start the development server:

```bash
npm run dev
```

The backend server will start on `http://localhost:3000`

### 6. Access the Frontend

Once the backend is running, the frontend will be served automatically. Open your web browser and navigate to:

```
http://localhost:3000
```
## Screenshots

### Game list & real-time chat
![Babyfoot Manager screenshot](screenshots/babyfoot-screenshot.png)

&gt; Replace the file name with the actual image(s) you added.