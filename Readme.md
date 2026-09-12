# Task API

A simple in-memory CRUD API for managing a to-do list, built with Node.js and Express as part of the FlyRank Backend AI Engineering internship (Week 2, Assignment A1).

## Install & Run

```bash
npm install
node index.js
```

The server starts on `http://localhost:3000`.

## Endpoints

| Method | Path         | Description             |
|--------|--------------|--------------------------|
| GET    | `/`          | API info                |
| GET    | `/health`    | Health check             |
| GET    | `/tasks`     | List all tasks           |
| GET    | `/tasks/:id` | Get a single task        |
| POST   | `/tasks`     | Create a new task        |
| PUT    | `/tasks/:id` | Update a task            |
| DELETE | `/tasks/:id` | Delete a task            |

## Example request

```
$ curl -i http://localhost:3000/tasks/1

HTTP/1.1 200 OK
Content-Type: application/json; charset=utf-8

{"id":1,"title":"Buy milk","done":true}
```

## Swagger UI

Interactive API docs available at `http://localhost:3000/docs`.

![Swagger UI](swagger-screenshot.png)

## Notes

Data is stored in memory and resets when the server restarts — there's no database yet (that's next week).
