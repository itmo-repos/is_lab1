import { useEffect, useState } from 'react';
import { api } from '../../api';
import { useAction } from '../../useAction';
import OperationCard, { Result } from '../OperationCard';

export default function RemoveCard() {
  const [disciplines, setDisciplines] = useState([]);
  const [disciplineId, setDisciplineId] = useState('');
  const [labWorkId, setLabWorkId] = useState('');
  const { result, error, run } = useAction();

  useEffect(() => {
    api.get('/disciplines').then(setDisciplines);
  }, []);

  function submit(event) {
    event.preventDefault();
    run(() => api.post(`/special/disciplines/${disciplineId}/labworks/${labWorkId}/remove`));
  }

  return (
    <OperationCard
      title="Удалить лабораторную из программы дисциплины"
      description="У лабораторной очищается дисциплина. Сама лабораторная остаётся в системе.">
      <form className="card-form" onSubmit={submit}>
        <select value={disciplineId} required onChange={(e) => setDisciplineId(e.target.value)}>
          <option value="">Дисциплина</option>
          {disciplines.map((d) => <option key={d.id} value={d.id}>{d.id}: {d.name}</option>)}
        </select>
        <input type="number" min="1" step="1" placeholder="ID лабораторной" value={labWorkId} required
               onChange={(e) => setLabWorkId(e.target.value)} />
        <button type="submit" className="primary">Удалить из программы</button>
      </form>
      <Result error={error}>
        {result && `Лабораторная ${result.id} «${result.name}» убрана из программы дисциплины`}
      </Result>
    </OperationCard>
  );
}
