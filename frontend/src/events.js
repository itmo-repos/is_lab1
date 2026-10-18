import { useEffect, useRef } from 'react';

const listeners = new Set();
let source = null;
let opened = false;

function connect() {
  source = new EventSource('api/events');
  source.addEventListener('changed', (event) => notify(event.data));
  source.onopen = () => {
    if (opened) {
      notify('all');
    }
    opened = true;
  };
}

function notify(entity) {
  listeners.forEach((listener) => listener(entity));
}

export function subscribe(listener) {
  if (source === null) {
    connect();
  }
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function useChanges(callback) {
  const ref = useRef(callback);
  ref.current = callback;
  useEffect(() => subscribe((entity) => ref.current(entity)), []);
}
