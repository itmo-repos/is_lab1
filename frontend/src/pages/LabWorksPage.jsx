import { useEffect, useRef, useState } from 'react';
import { api } from '../api';
import { COLUMNS, GROUP_ROW, cellValue } from '../columns';
import ConfirmDelete from '../components/ConfirmDelete';
import LabWorkDetails from '../components/LabWorkDetails';
import LabWorkForm from '../components/LabWorkForm';
import Modal from '../components/Modal';
import { useChanges } from '../events';

const PAGE_SIZES = [5, 10, 20, 50];
const TITLES = {
  create: 'Создание лабораторной',
  view: 'Информация о лабораторной',
  edit: 'Изменение лабораторной',
  delete: 'Удаление лабораторной',
};

export default function LabWorksPage() {
  const [data, setData] = useState({ items: [], total: 0 });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [sort, setSort] = useState(null);
  const [order, setOrder] = useState('asc');
  const [filters, setFilters] = useState({});
  const [reloadKey, setReloadKey] = useState(0);
  const [dialog, setDialog] = useState(null);
  const [searchId, setSearchId] = useState('');
  const [searchError, setSearchError] = useState(null);
  const typing = useRef(false);

  useChanges(() => setReloadKey((key) => key + 1));

  useEffect(() => {
    let cancelled = false;
    const delay = typing.current ? 200 : 0;
    typing.current = false;
    const timer = setTimeout(() => {
      setLoading(true);
      const params = new URLSearchParams({ page, size });
      if (sort) {
        params.set('sort', sort);
        params.set('order', order);
      }
      Object.entries(filters).forEach(([key, value]) => {
        if (value) {
          params.set(key, value);
        }
      });
      api.get('/labworks?' + params)
        .then((result) => {
          if (cancelled) {
            return;
          }
          setLoading(false);
          setError(null);
          if (result.items.length === 0 && page > 0) {
            setPage(page - 1);
          } else {
            setData(result);
          }
        })
        .catch((e) => {
          if (!cancelled) {
            setLoading(false);
            setError(e.message);
          }
        });
    }, delay);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [page, size, sort, order, filters, reloadKey]);

  function toggleSort(key) {
    if (sort !== key) {
      setSort(key);
      setOrder('asc');
    } else if (order === 'asc') {
      setOrder('desc');
    } else {
      setSort(null);
      setOrder('asc');
    }
    setPage(0);
  }

  function changeFilter(key, value) {
    typing.current = COLUMNS.find((column) => column.key === key).filter === 'text';
    setFilters({ ...filters, [key]: value });
    setPage(0);
  }

  async function openById(event) {
    event.preventDefault();
    try {
      const labWork = await api.get('/labworks/' + searchId);
      setSearchError(null);
      setDialog({ type: 'view', labWork });
    } catch (e) {
      setSearchError(e.message);
    }
  }

  function closeDialog() {
    setDialog(null);
  }

  const pageCount = Math.max(1, Math.ceil(data.total / size));

  return (
    <section>
      <h1>Лабораторные работы</h1>
      <div className="toolbar">
        <button type="button" className="primary" onClick={() => setDialog({ type: 'create' })}>Создать</button>
        <form onSubmit={openById}>
          <input type="number" min="1" step="1" placeholder="ID" value={searchId}
                 onChange={(e) => setSearchId(e.target.value)} required />
          <button type="submit">Открыть по ID</button>
        </form>
        {searchError && <span className="error">{searchError}</span>}
      </div>
      {dialog && (
        <Modal title={TITLES[dialog.type]} onClose={closeDialog}>
          {dialog.type === 'view' && <LabWorkDetails labWork={dialog.labWork} />}
          {(dialog.type === 'create' || dialog.type === 'edit') && (
            <LabWorkForm labWork={dialog.labWork} onSaved={closeDialog} onCancel={closeDialog} />
          )}
          {dialog.type === 'delete' && (
            <ConfirmDelete
              text={`Удалить лабораторную «${dialog.labWork.name}» (ID ${dialog.labWork.id})?`}
              onConfirm={async () => {
                await api.delete('/labworks/' + dialog.labWork.id);
                closeDialog();
              }}
              onCancel={closeDialog}
            />
          )}
        </Modal>
      )}
      {error && <p className="error">{error}</p>}
      <div className={loading ? 'table-wrap loading' : 'table-wrap'}>
        <table>
          <thead>
            <tr>
              {GROUP_ROW.map((group, index) => (
                <th key={index} colSpan={group.span} className="group">{group.title}</th>
              ))}
            </tr>
            <tr>
              {COLUMNS.map((column) => (
                <th key={column.key} onClick={() => toggleSort(column.key)}>
                  {column.title}
                  {sort === column.key && (order === 'asc' ? ' ▲' : ' ▼')}
                </th>
              ))}
              <th>Действия</th>
            </tr>
            <tr>
              {COLUMNS.map((column) => (
                <th key={column.key}>
                  <FilterInput
                    column={column}
                    value={filters[column.key] ?? ''}
                    onChange={(value) => changeFilter(column.key, value)}
                  />
                </th>
              ))}
              <th></th>
            </tr>
          </thead>
          <tbody>
            {data.items.map((row) => (
              <tr key={row.id}>
                {COLUMNS.map((column) => (
                  <td key={column.key}>{cellValue(row, column)}</td>
                ))}
                <td className="actions">
                  <button type="button" onClick={() => setDialog({ type: 'view', labWork: row })}>Подробнее</button>
                  <button type="button" onClick={() => setDialog({ type: 'edit', labWork: row })}>Изменить</button>
                  <button type="button" className="danger" onClick={() => setDialog({ type: 'delete', labWork: row })}>Удалить</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="pager">
        <button disabled={page === 0} onClick={() => setPage(page - 1)}>Назад</button>
        <span>Страница {page + 1} из {pageCount}, всего: {data.total}</span>
        <button disabled={page + 1 >= pageCount} onClick={() => setPage(page + 1)}>Вперёд</button>
        <select value={size} onChange={(e) => { setSize(Number(e.target.value)); setPage(0); }}>
          {PAGE_SIZES.map((s) => <option key={s} value={s}>{s} на странице</option>)}
        </select>
      </div>
    </section>
  );
}

function FilterInput({ column, value, onChange }) {
  if (column.filter === 'text') {
    return <input value={value} onChange={(e) => onChange(e.target.value)} placeholder="=" />;
  }
  if (column.filter === 'enum') {
    return (
      <select value={value} onChange={(e) => onChange(e.target.value)}>
        <option value="">все</option>
        {column.options.map((option) => <option key={option} value={option}>{option}</option>)}
      </select>
    );
  }
  return null;
}
