export default function OperationCard({ title, description, children }) {
  return (
    <div className="card">
      <h2>{title}</h2>
      <p className="card-description">{description}</p>
      {children}
    </div>
  );
}

export function Result({ error, children }) {
  if (error) {
    return <p className="error">{error}</p>;
  }
  return children ? <div className="result">{children}</div> : null;
}
