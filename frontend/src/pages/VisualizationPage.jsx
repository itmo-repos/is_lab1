import { useEffect, useState } from 'react';
import ClusterList from '../components/ClusterList';
import LabWorkDelete from '../components/LabWorkDelete';
import LabWorkForm from '../components/LabWorkForm';
import LabWorkView from '../components/LabWorkView';
import Modal from '../components/Modal';
import ScatterChart from '../components/ScatterChart';
import { DIFFICULTIES, DIFFICULTY_COLORS } from '../enums';
import { useChanges } from '../events';
import { loadAllLabWorks } from '../labworks';

const TITLES = {
  cluster: (dialog) => `Лабораторные в этой точке: ${dialog.labWorks.length}`,
  view: () => 'Информация о лабораторной',
  edit: () => 'Изменение лабораторной',
  delete: () => 'Удаление лабораторной',
};

export default function VisualizationPage() {
  const [labWorks, setLabWorks] = useState([]);
  const [error, setError] = useState(null);
  const [reloadKey, setReloadKey] = useState(0);
  const [dialog, setDialog] = useState(null);

  useChanges(() => setReloadKey((key) => key + 1));

  useEffect(() => {
    let cancelled = false;
    loadAllLabWorks()
      .then((list) => {
        if (!cancelled) {
          setLabWorks(list);
          setError(null);
        }
      })
      .catch((e) => !cancelled && setError(e.message));
    return () => {
      cancelled = true;
    };
  }, [reloadKey]);

  const points = labWorks.map((labWork) => ({
    id: labWork.id,
    x: labWork.coordinates.x,
    y: labWork.coordinates.y,
    difficulty: labWork.difficulty,
  }));

  function select(ids) {
    const selected = labWorks.filter((labWork) => ids.includes(labWork.id));
    if (selected.length === 1) {
      setDialog({ type: 'view', labWork: selected[0] });
    } else {
      setDialog({ type: 'cluster', labWorks: selected });
    }
  }

  function closeDialog() {
    setDialog(null);
  }

  return (
    <section>
      <h1>Визуализация</h1>
      <div className="legend">
        {DIFFICULTIES.map((difficulty) => (
          <span key={difficulty} className="legend-item">
            <span className="dot" style={{ background: DIFFICULTY_COLORS[difficulty] }} />
            {difficulty}
          </span>
        ))}
        <span className="legend-note">Круг стоит в точке с координатами, число внутри это количество лабораторных рядом, сектора это сложность. Клик открывает лабораторную или список.</span>
      </div>
      {error && <p className="error">{error}</p>}
      {labWorks.length === 0 ? <p>Лабораторных нет</p> : <ScatterChart points={points} onSelect={select} />}
      {dialog && (
        <Modal title={TITLES[dialog.type](dialog)} onClose={closeDialog}>
          {dialog.type === 'cluster' && (
            <ClusterList labWorks={dialog.labWorks}
                         onOpen={(labWork) => setDialog({ type: 'view', labWork })} />
          )}
          {dialog.type === 'view' && (
            <LabWorkView labWork={dialog.labWork} onClose={closeDialog}
                         onEdit={() => setDialog({ type: 'edit', labWork: dialog.labWork })}
                         onDelete={() => setDialog({ type: 'delete', labWork: dialog.labWork })} />
          )}
          {dialog.type === 'edit' && (
            <LabWorkForm labWork={dialog.labWork} onSaved={closeDialog} onCancel={closeDialog} />
          )}
          {dialog.type === 'delete' && <LabWorkDelete labWork={dialog.labWork} onDone={closeDialog} />}
        </Modal>
      )}
    </section>
  );
}
