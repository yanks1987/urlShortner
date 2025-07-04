# URL Shortener

Hello fellow recruitee, we need your help! We've been tasked to create a URL shortener, and as a new potential to our team we would like your help to create this application. The task is simple: we want to be able to create a short link for a given URL.

For example:
```
https://some.place.example.com/foo/bar/biz
```
should be shortened to
```
https://{domain}/abc123
```

---

## Requirements

- Build a React application that allows you enter a URL
- When the form is submitted, return a shortened version of the URL
- Save a record of the shortened URL to a database
- Ensure the slug of the URL (abc123 in the screenshot above) is unique
- When the shortened URL is accessed, redirect to the stored URL
- If an invalid slug is accessed, display a 404 Not Found page
- You should have a list of all URLs saved in the database
- Add support for accounts so people can view the URLs they have created
- Validate the URL provided is an actual URL
- Display an error message if invalid
- Make it easy to copy the shortened URL to the clipboard
- Allow users to modify the slug of their URL
- Track visits to the shortened URL
- Add rate-limiting to prevent bad-actors
- Add a dashboard showing how popular your URLs are
- Build a Docker image of your application

---

## FAQ

- **Can I use frameworks?**
  - Yes, it's encouraged.
- **Can I use a language other than TypeScript?**
  - No, we expect the solution to be in TypeScript only.
- **What stack do you use internally?**
  - Node.js with NestJS and PostgreSQL for backend
  - React with Next.js for frontend
- **Should I use an ORM?**
  - If you'd like.
- **What database should I use?**
  - Any, this is completely up to you.

---

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