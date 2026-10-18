import LabWorkDetails from './LabWorkDetails';

export default function LabWorkView({ labWork, onEdit, onDelete, onClose }) {
  return (
    <>
      <LabWorkDetails labWork={labWork} />
      <div className="form-buttons">
        <button type="button" className="primary" onClick={onEdit}>Изменить</button>
        <button type="button" className="danger" onClick={onDelete}>Удалить</button>
        <button type="button" onClick={onClose}>Закрыть</button>
      </div>
    </>
  );
}
