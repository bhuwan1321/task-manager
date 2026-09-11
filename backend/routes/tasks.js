const express = require('express');
const router = express.Router();
const { pool } = require('../db');

// Helper: validate task payload
function validateTaskInput(body, { partial = false } = {}) {
  const errors = [];
  const { title, description, completed, due_date } = body;

  if (!partial || title !== undefined) {
    if (typeof title !== 'string' || title.trim().length === 0) {
      errors.push('Title is required and must be a non-empty string.');
    } else if (title.length > 150) {
      errors.push('Title must be 150 characters or fewer.');
    }
  }

  if (description !== undefined && typeof description !== 'string') {
    errors.push('Description must be a string.');
  }
  if (description !== undefined && description.length > 2000) {
    errors.push('Description must be 2000 characters or fewer.');
  }

  if (completed !== undefined && typeof completed !== 'boolean') {
    errors.push('Completed must be a boolean.');
  }

  if (due_date !== undefined && due_date !== null) {
    if (typeof due_date !== 'string' || Number.isNaN(Date.parse(due_date))) {
      errors.push('Due date must be a valid date/time string.');
    }
  }

  return errors;
}

function isValidId(id) {
  return Number.isInteger(id);
}

// GET /api/tasks - list all tasks (optional ?status=completed|pending filter)
router.get('/', async (req, res, next) => {
  try {
    const { status } = req.query;
    let result;

    if (status === 'completed') {
      result = await pool.query('SELECT * FROM tasks WHERE completed = TRUE ORDER BY created_at DESC');
    } else if (status === 'pending') {
      result = await pool.query('SELECT * FROM tasks WHERE completed = FALSE ORDER BY created_at DESC');
    } else {
      result = await pool.query('SELECT * FROM tasks ORDER BY created_at DESC');
    }

    res.json(result.rows);
  } catch (err) {
    next(err);
  }
});

// GET /api/tasks/:id - get single task
router.get('/:id', async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    if (!isValidId(id)) {
      return res.status(400).json({ error: 'Invalid task id.' });
    }

    const result = await pool.query('SELECT * FROM tasks WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Task not found.' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    next(err);
  }
});

// POST /api/tasks - create a task
router.post('/', async (req, res, next) => {
  try {
    const errors = validateTaskInput(req.body);
    if (errors.length > 0) {
      return res.status(400).json({ errors });
    }

    const { title, description = '', completed = false, due_date = null } = req.body;

    const result = await pool.query(
      'INSERT INTO tasks (title, description, completed, due_date) VALUES ($1, $2, $3, $4) RETURNING *',
      [title.trim(), description, completed, due_date]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    next(err);
  }
});

// PUT /api/tasks/:id - update a task (title, description, completed, due_date)
router.put('/:id', async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    if (!isValidId(id)) {
      return res.status(400).json({ error: 'Invalid task id.' });
    }

    const existingResult = await pool.query('SELECT * FROM tasks WHERE id = $1', [id]);
    const existing = existingResult.rows[0];
    if (!existing) {
      return res.status(404).json({ error: 'Task not found.' });
    }

    const errors = validateTaskInput(req.body, { partial: true });
    if (errors.length > 0) {
      return res.status(400).json({ errors });
    }

    const title = req.body.title !== undefined ? req.body.title.trim() : existing.title;
    const description = req.body.description !== undefined ? req.body.description : existing.description;
    const completed = req.body.completed !== undefined ? req.body.completed : existing.completed;
    const due_date = req.body.due_date !== undefined ? req.body.due_date : existing.due_date;

    const result = await pool.query(
      `UPDATE tasks SET title = $1, description = $2, completed = $3, due_date = $4, updated_at = now()
       WHERE id = $5 RETURNING *`,
      [title, description, completed, due_date, id]
    );

    res.json(result.rows[0]);
  } catch (err) {
    next(err);
  }
});

// PATCH /api/tasks/:id/toggle - convenience endpoint to flip completed status
router.patch('/:id/toggle', async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    if (!isValidId(id)) {
      return res.status(400).json({ error: 'Invalid task id.' });
    }

    const existingResult = await pool.query('SELECT * FROM tasks WHERE id = $1', [id]);
    const existing = existingResult.rows[0];
    if (!existing) {
      return res.status(404).json({ error: 'Task not found.' });
    }

    const result = await pool.query(
      `UPDATE tasks SET completed = $1, updated_at = now() WHERE id = $2 RETURNING *`,
      [!existing.completed, id]
    );

    res.json(result.rows[0]);
  } catch (err) {
    next(err);
  }
});

// DELETE /api/tasks/:id - delete a task
router.delete('/:id', async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    if (!isValidId(id)) {
      return res.status(400).json({ error: 'Invalid task id.' });
    }

    const result = await pool.query('DELETE FROM tasks WHERE id = $1 RETURNING id', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Task not found.' });
    }

    res.status(204).send();
  } catch (err) {
    next(err);
  }
});

module.exports = router;