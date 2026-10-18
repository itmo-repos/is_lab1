import { COLORS, COUNTRIES, DIFFICULTIES } from './enums';

export const COLUMNS = [
  { key: 'id', title: 'ID' },
  { key: 'name', title: 'Название', filter: 'text' },
  { key: 'coordinates.x', title: 'Coordinates X' },
  { key: 'coordinates.y', title: 'Coordinates Y' },
  { key: 'creationDate', title: 'Создана', format: formatDate },
  { key: 'description', title: 'Описание', filter: 'text' },
  { key: 'difficulty', title: 'Сложность', filter: 'enum', options: DIFFICULTIES },
  { key: 'discipline.name', title: 'Дисциплина', filter: 'text' },
  { key: 'discipline.practiceHours', title: 'Часы практики' },
  { key: 'discipline.labsCount', title: 'Кол-во лаб' },
  { key: 'minimalPoint', title: 'Мин. балл' },
  { key: 'personalQualitiesMinimum', title: 'Мин. личные качества' },
  { key: 'author.name', title: 'Автор', filter: 'text' },
  { key: 'author.eyeColor', title: 'Цвет глаз', filter: 'enum', options: COLORS },
  { key: 'author.hairColor', title: 'Цвет волос', filter: 'enum', options: COLORS },
  { key: 'author.height', title: 'Рост' },
  { key: 'author.nationality', title: 'Национальность', filter: 'enum', options: COUNTRIES },
  { key: 'author.location.x', title: 'Location X' },
  { key: 'author.location.y', title: 'Location Y' },
  { key: 'author.location.name', title: 'Location', filter: 'text' },
];

export const GROUP_ROW = [
  { title: '', span: 2 },
  { title: 'Coordinates', span: 2 },
  { title: '', span: 3 },
  { title: 'Discipline', span: 3 },
  { title: '', span: 2 },
  { title: 'Person (автор)', span: 5 },
  { title: 'Location', span: 3 },
  { title: '', span: 1 },
];

export function formatDate(value) {
  return new Date(value).toLocaleString();
}

export function cellValue(row, column) {
  const value = column.key.split('.').reduce((object, part) => object?.[part], row);
  if (value === null || value === undefined) {
    return '';
  }
  return column.format ? column.format(value) : String(value);
}
