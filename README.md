# URL Shortener

A full-stack URL shortener application with React (TypeScript) frontend and Node.js (TypeScript) backend.

## Setup

### Running the Backend

#### Using Docker Compose (Recommended)
1. From the project root, run:
   ```sh
   docker compose up --build
   ```
   This will start both the backend and frontend containers.

#### Running Locally (Without Docker)
1. Open a terminal and navigate to the backend folder:
   ```sh
   cd backend
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Build the TypeScript code:
   ```sh
   npm run build
   ```
4. Start the backend server:
   ```sh
   npm start
   ```
   By default, the backend runs on [http://localhost:5000](http://localhost:5000).

---

### Running the Frontend

#### Using Docker Compose (Recommended)
1. From the project root, run:
   ```sh
   docker compose up --build
   ```
   This will start both the backend and frontend containers.

#### Running Locally (Without Docker)
1. Open a terminal and navigate to the frontend folder:
   ```sh
   cd frontend
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Start the frontend development server:
   ```sh
   npm start
   ```
   By default, the frontend runs on [http://localhost:3000](http://localhost:3000).