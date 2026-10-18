import { useEffect, useState } from 'react';
import { api } from '../api';
import { DIFFICULTIES } from '../enums';
import { REFERENCES } from '../references';
import FormField from './FormField';
import Modal from './Modal';
import ReferenceForm from './ReferenceForm';
import RefSelect from './RefSelect';

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

const REF_FIELDS = {
  coordinates: 'coordinatesId',
  discipline: 'disciplineId',
  person: 'authorId',
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
  const [options, setOptions] = useState({ coordinates: [], discipline: [], person: [] });
  const [creating, setCreating] = useState(null);

  useEffect(() => {
    Object.keys(REF_FIELDS).forEach((key) => {
      api.get(REFERENCES[key].path)
        .then((list) => setOptions((current) => ({ ...current, [key]: list })))
        .catch((e) => setMessage(e.message));
    });
  }, []);

  function setField(name, value) {
    setValues((current) => ({ ...current, [name]: value }));
  }

  function change(name) {
    return (event) => setField(name, event.target.value);
  }

  function created(key, item) {
    setOptions((current) => ({ ...current, [key]: [...current[key], item] }));
    setField(REF_FIELDS[key], String(item.id));
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

  function refSelect(key, required) {
    const field = REF_FIELDS[key];
    return (
      <RefSelect reference={REFERENCES[key]} options={options[key]} value={values[field]}
                 required={required} onChange={(value) => setField(field, value)}
                 onCreate={() => setCreating(key)} />
    );
  }

  return (
    <>
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
          {refSelect('coordinates', true)}
        </FormField>
        <FormField label="Дисциплина" error={errors.disciplineId}>
          {refSelect('discipline', false)}
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
          {refSelect('person', true)}
        </FormField>
        {message && <p className="error">{message}</p>}
        <div className="form-buttons">
          <button type="submit" className="primary">Сохранить</button>
          <button type="button" onClick={onCancel}>Отмена</button>
        </div>
      </form>
      {creating && (
        <Modal title={`Создание: ${REFERENCES[creating].title}`} onClose={() => setCreating(null)}>
          <ReferenceForm reference={REFERENCES[creating]} onDone={() => setCreating(null)}
                         onSaved={(item) => created(creating, item)} />
        </Modal>
      )}
    </>
  );
}
