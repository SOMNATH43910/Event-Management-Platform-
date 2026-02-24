# Event Management Platform

A full-stack application for event creation, registration, and real-time updates.

## Features

- **User Authentication** – Register and log in with JWT-secured endpoints
- **Event Management** – Create, update, delete, and view events via REST API
- **Event Registration** – Register or cancel registration for events with capacity enforcement
- **Real-time Notifications** – WebSocket-based live updates (socket.io) for event creation, status changes, and registrations

## Tech Stack

| Layer     | Technology                         |
|-----------|------------------------------------|
| Backend   | Node.js, Express, socket.io, JWT   |
| Frontend  | React 18, Axios, socket.io-client  |
| Auth      | JWT (jsonwebtoken) + bcryptjs      |
| Storage   | In-memory (easily swappable to DB) |

## Project Structure

```
├── backend/
│   ├── server.js            # Express + socket.io server
│   ├── middleware/
│   │   └── auth.js          # JWT verification middleware
│   ├── routes/
│   │   ├── auth.js          # POST /api/auth/register|login
│   │   └── events.js        # CRUD /api/events + registrations
│   └── __tests__/
│       └── api.test.js      # Backend API tests (Jest + Supertest)
└── frontend/
    └── src/
        ├── App.js
        ├── services/
        │   ├── api.js        # Axios client with JWT interceptor
        │   └── socket.js     # socket.io-client singleton
        └── components/
            ├── Auth/         # Login, Register
            ├── Events/       # EventList, EventCard, EventForm
            └── Notifications/# Real-time notification panel
```

## Getting Started

### Prerequisites

- Node.js ≥ 18

### Backend

```bash
cd backend
npm install
npm start        # runs on http://localhost:5000
```

### Frontend

```bash
cd frontend
npm install
npm start        # runs on http://localhost:3000
```

The frontend proxies API requests to `http://localhost:5000` via the `"proxy"` field in `package.json`.

### Running Backend Tests

```bash
cd backend
npm test
```

## REST API

### Auth

| Method | Endpoint              | Body                          | Auth | Description        |
|--------|-----------------------|-------------------------------|------|--------------------|
| POST   | `/api/auth/register`  | `{username, password, email}` | –    | Register a user    |
| POST   | `/api/auth/login`     | `{username, password}`        | –    | Log in, get token  |

### Events

| Method | Endpoint                       | Auth | Description                     |
|--------|--------------------------------|------|---------------------------------|
| GET    | `/api/events`                  | –    | List all events                 |
| GET    | `/api/events/:id`              | –    | Get a single event              |
| POST   | `/api/events`                  | ✓    | Create an event                 |
| PUT    | `/api/events/:id`              | ✓    | Update an event (owner only)    |
| DELETE | `/api/events/:id`              | ✓    | Delete an event (owner only)    |
| POST   | `/api/events/:id/register`     | ✓    | Register for an event           |
| DELETE | `/api/events/:id/register`     | ✓    | Cancel registration             |

### Authentication

Pass the JWT token as a `Bearer` token in the `Authorization` header:

```
Authorization: Bearer <token>
```

## WebSocket Events

The server emits these events to all connected clients:

| Event                  | Payload                                   | Description                        |
|------------------------|-------------------------------------------|------------------------------------|
| `event_created`        | `{ event }`                               | A new event was created            |
| `event_updated`        | `{ event }`                               | An event was updated               |
| `event_deleted`        | `{ eventId }`                             | An event was deleted               |
| `event_status_changed` | `{ eventId, title, previousStatus, newStatus }` | Status change (room-specific) |
| `event_registration`   | `{ eventId, title, username, registrationCount }` | New registration       |
| `event_unregistration` | `{ eventId, title, username, registrationCount }` | Registration cancelled |

Clients can join an event-specific room to receive targeted notifications:

```js
socket.emit('join_event', eventId);
```

## Environment Variables

### Backend

| Variable       | Default                    | Description                         |
|----------------|----------------------------|-------------------------------------|
| `PORT`         | `5000`                     | Server port                         |
| `JWT_SECRET`   | *(insecure default)*       | **Change this in production!**      |
| `FRONTEND_URL` | `http://localhost:3000`    | Allowed CORS origin                 |

### Frontend

| Variable              | Default                  | Description          |
|-----------------------|--------------------------|----------------------|
| `REACT_APP_API_URL`   | `/api`                   | Backend API base URL |
| `REACT_APP_SOCKET_URL`| `http://localhost:5000`  | socket.io server URL |
