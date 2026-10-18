import { useState } from 'react';
import { api } from '../../api';
import { useAction } from '../../useAction';
import OperationCard, { Result } from '../OperationCard';

export default function DecreaseCard() {
  const [id, setId] = useState('');
  const [steps, setSteps] = useState('');
  const { result, error, run } = useAction();

  function submit(event) {
    event.preventDefault();
    run(() => api.post(`/special/labworks/${id}/decrease-difficulty?steps=${steps}`));
  }

  return (
    <OperationCard
      title="Понизить сложность"
      description="Сложность идёт по порядку HARD, VERY_HARD, IMPOSSIBLE, INSANE. Ниже HARD опуститься нельзя.">
      <form className="card-form" onSubmit={submit}>
        <input type="number" min="1" step="1" placeholder="ID лабораторной" value={id} required
               onChange={(e) => setId(e.target.value)} />
        <input type="number" min="1" step="1" placeholder="Шагов" value={steps} required
               onChange={(e) => setSteps(e.target.value)} />
        <button type="submit" className="primary">Понизить</button>
      </form>
      <Result error={error}>
        {result && `Лабораторная ${result.id} «${result.name}»: сложность теперь ${result.difficulty}`}
      </Result>
    </OperationCard>
  );
}
