import { useEffect, useState } from 'react';
import { api } from '../api';
import { DIFFICULTIES } from '../enums';
import FormField from './FormField';

const EMPTY = {
  name: '',
  coordinatesId: '',
  description: '',
  difficulty: '',
  disciplineId: '',
  minimalPoint: '',
  personalQualitiesMinimum: '',
  authorId: '',
};

function toNumber(value) {
  return value === '' ? null : Number(value);
}

function text(value) {
  return value === undefined || value === null ? '' : String(value);
}

function toValues(labWork) {
  if (!labWork) {
    return EMPTY;
  }
  return {
    name: labWork.name,
    coordinatesId: text(labWork.coordinates.id),
    description: labWork.description,
    difficulty: labWork.difficulty,
    disciplineId: text(labWork.discipline?.id),
    minimalPoint: text(labWork.minimalPoint),
    personalQualitiesMinimum: text(labWork.personalQualitiesMinimum),
    authorId: text(labWork.author.id),
  };
}

export default function LabWorkForm({ labWork, onSaved, onCancel }) {
  const [values, setValues] = useState(() => toValues(labWork));
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState(null);
  const [coordinates, setCoordinates] = useState([]);
  const [disciplines, setDisciplines] = useState([]);
  const [persons, setPersons] = useState([]);

  useEffect(() => {
    Promise.all([api.get('/coordinates'), api.get('/disciplines'), api.get('/persons')])
      .then(([coordinatesList, disciplinesList, personsList]) => {
        setCoordinates(coordinatesList);
        setDisciplines(disciplinesList);
        setPersons(personsList);
      })
      .catch((e) => setMessage(e.message));
  }, []);

  function change(name) {
    return (event) => setValues({ ...values, [name]: event.target.value });
  }

  async function submit(event) {
    event.preventDefault();
    const dto = {
      name: values.name,
      coordinatesId: toNumber(values.coordinatesId),
      description: values.description,
      difficulty: values.difficulty || null,
      disciplineId: toNumber(values.disciplineId),
      minimalPoint: toNumber(values.minimalPoint),
      personalQualitiesMinimum: toNumber(values.personalQualitiesMinimum),
      authorId: toNumber(values.authorId),
    };
    try {
      if (labWork) {
        await api.put('/labworks/' + labWork.id, dto);
      } else {
        await api.post('/labworks', dto);
      }
      onSaved();
    } catch (e) {
      setErrors(e.fields ?? {});
      setMessage(Object.keys(e.fields ?? {}).length === 0 ? e.message : null);
    }
  }

  return (
    <form onSubmit={submit}>
      <FormField label="Название" error={errors.name}>
        <input value={values.name} onChange={change('name')} required />
      </FormField>
      <FormField label="Описание" error={errors.description}>
        <input value={values.description} onChange={change('description')} />
      </FormField>
      <FormField label="Сложность" error={errors.difficulty}>
        <select value={values.difficulty} onChange={change('difficulty')} required>
          <option value="">выберите</option>
          {DIFFICULTIES.map((d) => <option key={d} value={d}>{d}</option>)}
        </select>
      </FormField>
      <FormField label="Координаты" error={errors.coordinatesId}>
        <select value={values.coordinatesId} onChange={change('coordinatesId')} required>
          <option value="">выберите</option>
          {coordinates.map((c) => <option key={c.id} value={c.id}>{c.id}: ({c.x}; {c.y})</option>)}
        </select>
      </FormField>
      <FormField label="Дисциплина" error={errors.disciplineId}>
        <select value={values.disciplineId} onChange={change('disciplineId')}>
          <option value="">нет</option>
          {disciplines.map((d) => <option key={d.id} value={d.id}>{d.id}: {d.name}</option>)}
        </select>
      </FormField>
      <FormField label="Минимальный балл" error={errors.minimalPoint}>
        <input type="number" min="0" step="any" value={values.minimalPoint}
               onChange={change('minimalPoint')} />
      </FormField>
      <FormField label="Минимум личных качеств" error={errors.personalQualitiesMinimum}>
        <input type="number" min="1" step="1" value={values.personalQualitiesMinimum}
               onChange={change('personalQualitiesMinimum')} />
      </FormField>
      <FormField label="Автор" error={errors.authorId}>
        <select value={values.authorId} onChange={change('authorId')} required>
          <option value="">выберите</option>
          {persons.map((p) => <option key={p.id} value={p.id}>{p.id}: {p.name}</option>)}
        </select>
      </FormField>
      {message && <p className="error">{message}</p>}
      <div className="form-buttons">
        <button type="submit">Сохранить</button>
        <button type="button" onClick={onCancel}>Отмена</button>
      </div>
    </form>
  );
}
