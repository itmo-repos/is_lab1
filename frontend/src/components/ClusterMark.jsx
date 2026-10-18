import { radius } from '../clusters';
import { DIFFICULTIES, DIFFICULTY_COLORS } from '../enums';

function slicePath(x, y, r, from, to) {
  const x0 = x + r * Math.cos(from);
  const y0 = y + r * Math.sin(from);
  const x1 = x + r * Math.cos(to);
  const y1 = y + r * Math.sin(to);
  const large = to - from > Math.PI ? 1 : 0;
  return `M ${x} ${y} L ${x0} ${y0} A ${r} ${r} 0 ${large} 1 ${x1} ${y1} Z`;
}

export default function ClusterMark({ cluster, onClick }) {
  const { x, y, members } = cluster;
  const total = members.length;
  const r = radius(total);
  const counts = DIFFICULTIES
    .map((difficulty) => ({
      difficulty,
      count: members.filter((member) => member.difficulty === difficulty).length,
    }))
    .filter((item) => item.count > 0);
  const title = `Лабораторных: ${total} (${counts.map((c) => `${c.difficulty}: ${c.count}`).join(', ')})`;

  let angle = -Math.PI / 2;
  const slices = counts.map((item) => {
    const from = angle;
    angle += (item.count / total) * 2 * Math.PI;
    return { ...item, path: slicePath(x, y, r, from, angle) };
  });

  return (
    <g className="cluster" onClick={onClick}>
      <title>{title}</title>
      {counts.length === 1 ? (
        <circle cx={x} cy={y} r={r} fill={DIFFICULTY_COLORS[counts[0].difficulty]} />
      ) : (
        slices.map((slice) => (
          <path key={slice.difficulty} d={slice.path} fill={DIFFICULTY_COLORS[slice.difficulty]} />
        ))
      )}
      {total > 1 && (
        <>
          <circle className="hole" cx={x} cy={y} r={r * 0.6} />
          <text x={x} y={y} textAnchor="middle" dominantBaseline="central">{total}</text>
        </>
      )}
    </g>
  );
}
