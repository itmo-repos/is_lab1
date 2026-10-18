import { useEffect, useState } from 'react';
import { api } from '../api';
import { useChanges } from '../events';
import Modal from './Modal';
import ReferenceDelete from './ReferenceDelete';
import ReferenceForm from './ReferenceForm';

export default function ReferenceTable({ reference }) {
  const [items, setItems] = useState([]);
  const [error, setError] = useState(null);
  const [reloadKey, setReloadKey] = useState(0);
  const [dialog, setDialog] = useState(null);

  useChanges(() => setReloadKey((key) => key + 1));

  useEffect(() => {
    let cancelled = false;
    api.get(reference.path)
      .then((list) => {
        if (!cancelled) {
          setItems(list);
          setError(null);
        }
      })
      .catch((e) => !cancelled && setError(e.message));
    return () => {
      cancelled = true;
    };
  }, [reference, reloadKey]);

  function closeDialog() {
    setDialog(null);
  }

  function title() {
    if (dialog.type === 'create') {
      return `Создание: ${reference.title}`;
    }
    const action = dialog.type === 'edit' ? 'Изменение' : 'Удаление';
    return `${action}: ${reference.title} ${dialog.item.id}`;
  }

  return (
    <div>
      <div className="toolbar">
        <button type="button" className="primary" onClick={() => setDialog({ type: 'create' })}>
          Создать
        </button>
        {error && <span className="error">{error}</span>}
      </div>
      <div className="table-wrap ref-table">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              {reference.fields.map((field) => <th key={field.name}>{field.label}</th>)}
              <th>Действия</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id}>
                <td>{item.id}</td>
                {reference.fields.map((field) => (
                  <td key={field.name}>{item[field.name] ?? ''}</td>
                ))}
                <td className="actions">
                  <button type="button" onClick={() => setDialog({ type: 'edit', item })}>Изменить</button>
                  <button type="button" className="danger" onClick={() => setDialog({ type: 'delete', item })}>
                    Удалить
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {dialog && (
        <Modal title={title()} onClose={closeDialog}>
          {dialog.type === 'delete' ? (
            <ReferenceDelete reference={reference} item={dialog.item} onDone={closeDialog} />
          ) : (
            <ReferenceForm reference={reference} item={dialog.item} onDone={closeDialog} />
          )}
        </Modal>
      )}
    </div>
  );
}
