import { useState } from 'react';
import { api } from '../api';

export default function ReferenceDelete({ reference, item, onDone }) {
  const [conflict, setConflict] = useState(null);
  const [replaceWith, setReplaceWith] = useState('');
  const [message, setMessage] = useState(null);

  async function remove(query) {
    try {
      await api.delete(`${reference.path}/${item.id}${query}`);
      onDone();
    } catch (e) {
      if (e.status === 409) {
        const all = await api.get(reference.path);
        setConflict({ message: e.message, choices: all.filter((other) => other.id !== item.id) });
        setMessage(null);
      } else {
        setMessage(e.message);
      }
    }
  }

  if (conflict) {
    return (
      <div>
        <p>{conflict.message}</p>
        {conflict.choices.length === 0 ? (
          <p className="error">Других объектов нет, заменить не на что.</p>
        ) : (
          <select value={replaceWith} onChange={(e) => setReplaceWith(e.target.value)}>
            <option value="">выберите замену</option>
            {conflict.choices.map((choice) => (
              <option key={choice.id} value={choice.id}>{reference.label(choice)}</option>
            ))}
          </select>
        )}
        {message && <p className="error">{message}</p>}
        <div className="form-buttons">
          <button type="button" className="danger" disabled={replaceWith === ''}
                  onClick={() => remove(`?replaceWith=${replaceWith}`)}>
            Заменить и удалить
          </button>
          <button type="button" onClick={onDone}>Отмена</button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <p>Удалить «{reference.label(item)}»?</p>
      {message && <p className="error">{message}</p>}
      <div className="form-buttons">
        <button type="button" className="danger" onClick={() => remove('')}>Удалить</button>
        <button type="button" onClick={onDone}>Отмена</button>
      </div>
    </div>
  );
}
