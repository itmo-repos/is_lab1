import { useState } from 'react';

export default function ConfirmDelete({ text, onConfirm, onCancel }) {
  const [message, setMessage] = useState(null);

  async function confirm() {
    try {
      await onConfirm();
    } catch (e) {
      setMessage(e.message);
    }
  }

  return (
    <div>
      <p>{text}</p>
      {message && <p className="error">{message}</p>}
      <div className="form-buttons">
        <button type="button" onClick={confirm}>Удалить</button>
        <button type="button" onClick={onCancel}>Отмена</button>
      </div>
    </div>
  );
}
