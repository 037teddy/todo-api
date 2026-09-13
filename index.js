const express = require('express');
const swaggerUi = require('swagger-ui-express');
const openapiSpec = require('./openapi.json');
const db = require('./pgdb');
const app = express();
app.use(express.json());
app.get('/', (req, res) => {
  res.json({
    name: "Task API",
    version: "1.0",
    endpoints: ["/tasks"]
  });
});

app.get('/health', (req, res) => {
  res.json({ status: "ok" });
});
app.get('/tasks', async (req, res) => {
  const result = await db.query('SELECT * FROM tasks');
  res.json(result.rows);
});

app.get('/tasks/:id', async (req, res) => {
  const result = await db.query('SELECT * FROM tasks WHERE id = $1', [req.params.id]);
  const task = result.rows[0];
  if (!task) {
    return res.status(404).json({ error: `Task ${req.params.id} not found` });
  }
  res.json(task);
});
app.post('/tasks', async (req, res) => {
  const { title } = req.body;

  if (!title || title.trim() === '') {
    return res.status(400).json({ error: "Title is required" });
  }

  const result = await db.query(
    'INSERT INTO tasks (title, done) VALUES ($1, $2) RETURNING *',
    [title, false]
  );
  res.status(201).json(result.rows[0]);
});

app.put('/tasks/:id', async (req, res) => {
  const existing = await db.query('SELECT * FROM tasks WHERE id = $1', [req.params.id]);
  const task = existing.rows[0];
  if (!task) {
    return res.status(404).json({ error: `Task ${req.params.id} not found` });
  }

  const { title, done } = req.body;

  if (title !== undefined && title.trim() === '') {
    return res.status(400).json({ error: "Title cannot be empty" });
  }

  const newTitle = title !== undefined ? title : task.title;
  const newDone = done !== undefined ? done : task.done;

  const result = await db.query(
    'UPDATE tasks SET title = $1, done = $2 WHERE id = $3 RETURNING *',
    [newTitle, newDone, req.params.id]
  );
  res.json(result.rows[0]);
});

app.delete('/tasks/:id', async (req, res) => {
  const existing = await db.query('SELECT * FROM tasks WHERE id = $1', [req.params.id]);
  if (!existing.rows[0]) {
    return res.status(404).json({ error: `Task ${req.params.id} not found` });
  }

  await db.query('DELETE FROM tasks WHERE id = $1', [req.params.id]);
  res.status(204).send();
});
app.use('/docs', swaggerUi.serve, swaggerUi.setup(openapiSpec));
app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});