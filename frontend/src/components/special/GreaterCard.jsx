import { useState } from 'react';
import { api } from '../../api';
import { useAction } from '../../useAction';
import OperationCard, { Result } from '../OperationCard';

export default function GreaterCard() {
  const [value, setValue] = useState('');
  const { result, error, run } = useAction();

  function submit(event) {
    event.preventDefault();
    run(() => api.get('/special/minimal-point-greater?value=' + value));
  }

  return (
    <OperationCard
      title="minimalPoint больше заданного"
      description="Возвращает лабораторные, у которых минимальный балл больше введённого значения.">
      <form className="card-form" onSubmit={submit}>
        <input type="number" step="any" placeholder="Значение" value={value} required
               onChange={(e) => setValue(e.target.value)} />
        <button type="submit" className="primary">Найти</button>
      </form>
      <Result error={error}>
        {result && (result.length === 0 ? 'Подходящих лабораторных нет' : (
          <div className="result-table">
            <table>
              <thead>
                <tr><th>id</th><th>Название</th><th>Сложность</th><th>Мин. балл</th></tr>
              </thead>
              <tbody>
                {result.map((labWork) => (
                  <tr key={labWork.id}>
                    <td>{labWork.id}</td>
                    <td>{labWork.name}</td>
                    <td>{labWork.difficulty}</td>
                    <td>{labWork.minimalPoint}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}
      </Result>
    </OperationCard>
  );
}
