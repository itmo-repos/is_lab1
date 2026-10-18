import { useEffect, useState } from 'react';
import { api } from '../api';
import { REFERENCES } from '../references';
import FormField from './FormField';

function text(value) {
  return value === undefined || value === null ? '' : String(value);
}

function toValues(reference, item) {
  return Object.fromEntries(reference.fields.map((field) => [field.name, text(item?.[field.name])]));
}

function toValue(field, value) {
  if (field.type === 'number' || field.type === 'ref') {
    return value === '' ? null : Number(value);
  }
  if (field.type === 'enum' || !field.required) {
    return value === '' ? null : value;
  }
  return value;
}

export default function ReferenceForm({ reference, item, onDone }) {
  const [values, setValues] = useState(() => toValues(reference, item));
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState(null);
  const [options, setOptions] = useState({});

  useEffect(() => {
    reference.fields.filter((field) => field.type === 'ref').forEach((field) => {
      api.get(REFERENCES[field.refKey].path)
        .then((list) => setOptions((current) => ({ ...current, [field.name]: list })))
        .catch((e) => setMessage(e.message));
    });
  }, [reference]);

  async function submit(event) {
    event.preventDefault();
    const dto = Object.fromEntries(
      reference.fields.map((field) => [field.name, toValue(field, values[field.name])]));
    try {
      if (item) {
        await api.put(`${reference.path}/${item.id}`, dto);
      } else {
        await api.post(reference.path, dto);
      }
      onDone();
    } catch (e) {
      setErrors(e.fields ?? {});
      setMessage(Object.keys(e.fields ?? {}).length === 0 ? e.message : null);
    }
  }

  return (
    <form onSubmit={submit}>
      {reference.fields.map((field) => (
        <FormField key={field.name} label={field.label} error={errors[field.name]}>
          <Input
            field={field}
            value={values[field.name]}
            options={options[field.name]}
            onChange={(value) => setValues({ ...values, [field.name]: value })}
          />
        </FormField>
      ))}
      {message && <p className="error">{message}</p>}
      <div className="form-buttons">
        <button type="submit" className="primary">Сохранить</button>
        <button type="button" onClick={onDone}>Отмена</button>
      </div>
    </form>
  );
}

function Input({ field, value, options, onChange }) {
  const change = (event) => onChange(event.target.value);
  if (field.type === 'enum') {
    return (
      <select value={value} onChange={change} required={field.required}>
        <option value="">{field.required ? 'выберите' : 'нет'}</option>
        {field.options.map((option) => <option key={option} value={option}>{option}</option>)}
      </select>
    );
  }
  if (field.type === 'ref') {
    const refReference = REFERENCES[field.refKey];
    return (
      <select value={value} onChange={change} required={field.required}>
        <option value="">{field.required ? 'выберите' : 'нет'}</option>
        {(options ?? []).map((option) => (
          <option key={option.id} value={option.id}>{refReference.label(option)}</option>
        ))}
      </select>
    );
  }
  if (field.type === 'number') {
    return (
      <input type="number" value={value} onChange={change} required={field.required}
             min={field.min} max={field.max} step={field.step} />
    );
  }
  return <input value={value} onChange={change} required={field.required} />;
}
