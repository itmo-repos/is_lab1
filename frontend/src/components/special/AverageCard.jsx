import { api } from '../../api';
import { useAction } from '../../useAction';
import OperationCard, { Result } from '../OperationCard';

export default function AverageCard() {
  const { result, error, run } = useAction();

  return (
    <OperationCard
      title="Среднее значение minimalPoint"
      description="Считается по всем лабораторным, у которых задан минимальный балл.">
      <button type="button" className="primary"
              onClick={() => run(() => api.get('/special/average-minimal-point'))}>
        Рассчитать
      </button>
      <Result error={error}>
        {result && (result.value === undefined
          ? 'Нет лабораторных с заданным минимальным баллом'
          : `Среднее: ${Math.round(result.value * 100) / 100}`)}
      </Result>
    </OperationCard>
  );
}
