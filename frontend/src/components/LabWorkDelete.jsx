import { api } from '../api';
import ConfirmDelete from './ConfirmDelete';

export default function LabWorkDelete({ labWork, onDone }) {
  return (
    <ConfirmDelete
      text={`Удалить лабораторную «${labWork.name}» (ID ${labWork.id})?`}
      onConfirm={async () => {
        await api.delete('/labworks/' + labWork.id);
        onDone();
      }}
      onCancel={onDone}
    />
  );
}
