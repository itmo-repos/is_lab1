import { COLORS, COUNTRIES } from './enums';

export const REFERENCES = {
  coordinates: {
    title: 'Coordinates',
    path: '/coordinates',
    label: (item) => `${item.id}: (${item.x}; ${item.y})`,
    fields: [
      { name: 'x', label: 'X', type: 'number', required: true, step: 1, max: 577 },
      { name: 'y', label: 'Y', type: 'number', required: true, step: 'any' },
    ],
  },
  discipline: {
    title: 'Discipline',
    path: '/disciplines',
    label: (item) => `${item.id}: ${item.name}`,
    fields: [
      { name: 'name', label: 'Название', type: 'text', required: true },
      { name: 'practiceHours', label: 'Часы практики', type: 'number', required: true, step: 1 },
      { name: 'labsCount', label: 'Количество лабораторных', type: 'number', required: true, step: 1 },
    ],
  },
  location: {
    title: 'Location',
    path: '/locations',
    label: (item) => `${item.id}: ${item.name ?? `(${item.x}; ${item.y})`}`,
    fields: [
      { name: 'x', label: 'X', type: 'number', required: true, step: 1 },
      { name: 'y', label: 'Y', type: 'number', required: true, step: 1 },
      { name: 'name', label: 'Название', type: 'text' },
    ],
  },
  person: {
    title: 'Person',
    path: '/persons',
    label: (item) => `${item.id}: ${item.name}`,
    fields: [
      { name: 'name', label: 'Имя', type: 'text', required: true },
      { name: 'eyeColor', label: 'Цвет глаз', type: 'enum', required: true, options: COLORS },
      { name: 'hairColor', label: 'Цвет волос', type: 'enum', options: COLORS },
      { name: 'locationId', label: 'Локация', type: 'ref', refKey: 'location' },
      { name: 'height', label: 'Рост', type: 'number', required: true, min: 1, step: 1 },
      { name: 'nationality', label: 'Национальность', type: 'enum', required: true, options: COUNTRIES },
    ],
  },
};
