import { DIFFICULTY_COLORS } from '../enums';

export default function ClusterList({ labWorks, onOpen }) {
  return (
    <div className="result-table">
      <table>
        <thead>
          <tr><th>id</th><th>Название</th><th>Сложность</th><th></th></tr>
        </thead>
        <tbody>
          {labWorks.map((labWork) => (
            <tr key={labWork.id}>
              <td>{labWork.id}</td>
              <td>{labWork.name}</td>
              <td>
                <span className="dot" style={{ background: DIFFICULTY_COLORS[labWork.difficulty] }} />
                {' '}{labWork.difficulty}
              </td>
              <td><button type="button" onClick={() => onOpen(labWork)}>Открыть</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
