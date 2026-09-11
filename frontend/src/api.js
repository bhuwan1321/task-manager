const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

async function handleResponse(res) {
  if (res.status === 204) return null;

  let data;
  try {
    data = await res.json();
  } catch {
    data = null;
  }

  if (!res.ok) {
    const message =
      (data && (data.error || (data.errors && data.errors.join(' ')))) ||
      `Request failed with status ${res.status}`;
    throw new Error(message);
  }

  return data;
}

export async function getTasks(status) {
  const query = status ? `?status=${status}` : '';
  const res = await fetch(`${API_BASE}/tasks${query}`);
  return handleResponse(res);
}

export async function createTask(task) {
  const res = await fetch(`${API_BASE}/tasks`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(task),
  });
  return handleResponse(res);
}

export async function updateTask(id, updates) {
  const res = await fetch(`${API_BASE}/tasks/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updates),
  });
  return handleResponse(res);
}

export async function toggleTask(id) {
  const res = await fetch(`${API_BASE}/tasks/${id}/toggle`, {
    method: 'PATCH',
  });
  return handleResponse(res);
}

export async function deleteTask(id) {
  const res = await fetch(`${API_BASE}/tasks/${id}`, {
    method: 'DELETE',
  });
  return handleResponse(res);
}
