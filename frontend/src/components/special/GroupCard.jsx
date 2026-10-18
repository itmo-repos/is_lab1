import { api } from '../../api';
import { useAction } from '../../useAction';
import OperationCard, { Result } from '../OperationCard';

export default function GroupCard() {
  const { result, error, run } = useAction();

  return (
    <OperationCard
      title="Группировка по id"
      description="Объекты группируются по значению id, для каждой группы выводится количество элементов.">
      <button type="button" className="primary"
              onClick={() => run(() => api.get('/special/group-by-id'))}>
        Сгруппировать
      </button>
      <Result error={error}>
        {result && (result.length === 0 ? 'Лабораторных нет' : (
          <div className="result-table">
            <table>
              <thead>
                <tr><th>id</th><th>Количество</th></tr>
              </thead>
              <tbody>
                {result.map((group) => (
                  <tr key={group.id}><td>{group.id}</td><td>{group.count}</td></tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}
      </Result>
    </OperationCard>
  );
}
