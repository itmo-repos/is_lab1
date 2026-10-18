import { api } from './api';

const PAGE_SIZE = 100;

export async function loadAllLabWorks() {
  const all = [];
  for (let page = 0; ; page++) {
    const result = await api.get(`/labworks?page=${page}&size=${PAGE_SIZE}`);
    all.push(...result.items);
    if (all.length >= result.total || result.items.length === 0) {
      return all;
    }
  }
}
