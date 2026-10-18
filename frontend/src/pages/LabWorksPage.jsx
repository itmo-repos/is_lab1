import { useState } from 'react';
import { useChanges } from '../events';

export default function LabWorksPage() {
  const [last, setLast] = useState('нет');
  useChanges((entity) => setLast(entity));

  return (
    <section>
      <h1>Лабораторные работы</h1>
      <p>Последнее событие: {last}</p>
    </section>
  );
}
