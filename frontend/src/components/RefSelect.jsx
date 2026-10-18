export default function RefSelect({ reference, options, value, required, onChange, onCreate }) {
  return (
    <div className="select-row">
      <select value={value} required={required} onChange={(event) => onChange(event.target.value)}>
        <option value="">{required ? 'выберите' : 'нет'}</option>
        {options.map((option) => (
          <option key={option.id} value={option.id}>{reference.label(option)}</option>
        ))}
      </select>
      <button type="button" title={`Создать: ${reference.title}`} onClick={onCreate}>+</button>
    </div>
  );
}
