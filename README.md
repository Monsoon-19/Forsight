# Foresight

An AI-powered predictive infrastructure monitoring dashboard modeled after Grafana, Datadog, and Linear.

## Architecture
- **Frontend**: React, Vite, Tailwind CSS, socket.io-client.
- **Backend**: Node.js, Express, Socket.IO, Mongoose, systeminformation.

## Setup Instructions

### 1. Prerequisites
- Node.js v18+
- MongoDB Atlas account (or local MongoDB)

### 2. Backend Setup
1. Navigate to the `backend/` directory.
2. Run `npm install`.
3. Create a `.env` file in `backend/` using the provided `.env.example` as a template.
   - Set `MONGODB_URI` to your Atlas connection string.
   - Set `JWT_SECRET` and `JWT_REFRESH_SECRET` to secure random strings.
4. Run `npm start` (or `npm run dev` for nodemon).

### 3. Frontend Setup
1. Navigate to the root directory.
2. Run `npm install`.
3. Run `npm run dev`.
4. Open the provided localhost URL.

## Manual Deployment

### Backend (Render)
1. Create a new Web Service on Render.
2. Connect your GitHub repository.
3. Set the Root Directory to `backend`.
4. Set Build Command to `npm install` and Start Command to `npm start`.
5. Add all Environment Variables (`MONGODB_URI`, `JWT_SECRET`, etc.).
6. Deploy.

### Frontend (Vercel)
1. Import your GitHub repository to Vercel.
2. The framework preset should automatically detect Vite.
3. Ensure the Build Command is `npm run build` and Output Directory is `dist`.
4. Deploy.

## Environment Variables
The following environment variables are required for the backend:
- `PORT`
- `MONGODB_URI`
- `JWT_SECRET`
- `JWT_REFRESH_SECRET`
