# RagsToRiches

`RagsToRiches` is a two-part app:

- `Backend/`: Java + Maven + Javalin API + MongoDB
- `Frontend/`: Vite + React + TypeScript

## Prerequisites

- Node.js 18+
- npm
- Java 21 recommended
- Maven
- MongoDB connection string

## Environment Setup

Create `Backend/.env`:

```env
MONGODB_URI=mongodb+srv://<user>:<password>@<cluster>/<database>?retryWrites=true&w=majority
JWT_SECRET=replace-with-a-random-secret-at-least-32-characters
BACKEND_PORT=8081
GEMINI_API_KEY=optional
```

Create `Frontend/.env`:

```env
VITE_API_URL=http://localhost:8081/api
```

## Run Locally

Start the backend:

```sh
cd Backend
mvn exec:java
```

Start the frontend in a second terminal:

```sh
cd Frontend
npm install
npm run dev
```

Open the frontend at `http://localhost:5173`.

## Quick Checks

Backend health check:

```sh
curl -i http://localhost:8081/api/cards
```

Build verification:

```sh
cd Backend && mvn -DskipTests compile
cd Frontend && npm run build
```

## Docker

There is also a root `docker-compose.yml` if you want to run the project with Docker:

```sh
docker-compose up --build
```

## Notes

- The frontend talks only to the backend API, not directly to MongoDB.
- Auth endpoints are under `/api/auth/*`.
- Do not commit real secrets in `.env` files.
