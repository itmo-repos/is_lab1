const BASE = 'api';

export class ApiError extends Error {
  constructor(status, message, fields) {
    super(message);
    this.status = status;
    this.fields = fields;
  }
}

async function request(method, path, body) {
  const response = await fetch(BASE + path, {
    method,
    headers: body === undefined ? {} : { 'Content-Type': 'application/json' },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  if (response.status === 204) {
    return null;
  }
  const text = await response.text();
  let data = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = null;
  }
  if (!response.ok) {
    throw toError(response.status, data);
  }
  return data;
}

function toError(status, data) {
  if (data && data.errors) {
    const fields = Object.fromEntries(data.errors.map((e) => [e.field, e.message]));
    return new ApiError(status, data.errors.map((e) => e.message).join('; '), fields);
  }
  if (data && data.message) {
    return new ApiError(status, data.message, {});
  }
  if (status === 404) {
    return new ApiError(status, 'Объект не найден', {});
  }
  return new ApiError(status, `Ошибка сервера (${status})`, {});
}

export const api = {
  get: (path) => request('GET', path),
  post: (path, body) => request('POST', path, body),
  put: (path, body) => request('PUT', path, body),
  delete: (path) => request('DELETE', path),
};
