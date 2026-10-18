import { useState } from 'react';
import ReferenceTable from '../components/ReferenceTable';
import { REFERENCES } from '../references';

export default function ReferencesPage() {
  const [current, setCurrent] = useState('coordinates');

  return (
    <section>
      <h1>Справочники</h1>
      <div className="tabs">
        {Object.entries(REFERENCES).map(([key, reference]) => (
          <button key={key} type="button" className={key === current ? 'active' : ''}
                  onClick={() => setCurrent(key)}>
            {reference.title}
          </button>
        ))}
      </div>
      <ReferenceTable key={current} reference={REFERENCES[current]} />
    </section>
  );
}
