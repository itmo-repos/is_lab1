export default function Modal({ title, onClose, children }) {
  return (
    <div className="overlay">
      <div className="modal">
        <div className="modal-header">
          <h2>{title}</h2>
          <button type="button" onClick={onClose}>✕</button>
        </div>
        {children}
      </div>
    </div>
  );
}
