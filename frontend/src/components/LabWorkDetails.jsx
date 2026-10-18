import { formatDate } from '../columns';

function show(value) {
  return value === undefined || value === null ? '—' : String(value);
}

function Section({ title, rows }) {
  return (
    <>
      <h3>{title}</h3>
      {rows.map(([label, value]) => (
        <div key={label} className="detail-row">
          <span>{label}</span>
          <span>{show(value)}</span>
        </div>
      ))}
    </>
  );
}

export default function LabWorkDetails({ labWork }) {
  const { coordinates, discipline, author } = labWork;
  const location = author.location;
  return (
    <div>
      <Section title="Лабораторная" rows={[
        ['ID', labWork.id],
        ['Название', labWork.name],
        ['Создана', formatDate(labWork.creationDate)],
        ['Описание', labWork.description],
        ['Сложность', labWork.difficulty],
        ['Минимальный балл', labWork.minimalPoint],
        ['Минимум личных качеств', labWork.personalQualitiesMinimum],
      ]} />
      <Section title="Координаты" rows={[
        ['ID', coordinates.id],
        ['X', coordinates.x],
        ['Y', coordinates.y],
      ]} />
      <Section title="Дисциплина" rows={discipline ? [
        ['ID', discipline.id],
        ['Название', discipline.name],
        ['Часы практики', discipline.practiceHours],
        ['Количество лабораторных', discipline.labsCount],
      ] : [['Дисциплина', null]]} />
      <Section title="Автор" rows={[
        ['ID', author.id],
        ['Имя', author.name],
        ['Цвет глаз', author.eyeColor],
        ['Цвет волос', author.hairColor],
        ['Рост', author.height],
        ['Национальность', author.nationality],
      ]} />
      <Section title="Локация автора" rows={location ? [
        ['ID', location.id],
        ['X', location.x],
        ['Y', location.y],
        ['Название', location.name],
      ] : [['Локация', null]]} />
    </div>
  );
}
