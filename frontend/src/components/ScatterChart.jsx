import { clusterPoints } from '../clusters';
import ClusterMark from './ClusterMark';

const WIDTH = 900;
const HEIGHT = 520;
const MARGIN = { left: 60, right: 20, top: 20, bottom: 50 };
const TICKS = 6;

function extent(values) {
  let min = Math.min(...values);
  let max = Math.max(...values);
  if (min === max) {
    min -= 1;
    max += 1;
  }
  const padding = (max - min) * 0.05;
  return [min - padding, max + padding];
}

function ticks([min, max]) {
  return Array.from({ length: TICKS }, (_, i) => min + ((max - min) * i) / (TICKS - 1));
}

function format(value) {
  return Math.round(value * 100) / 100;
}

export default function ScatterChart({ points, onSelect }) {
  const [x0, x1] = extent(points.map((point) => point.x));
  const [y0, y1] = extent(points.map((point) => point.y));
  const plotWidth = WIDTH - MARGIN.left - MARGIN.right;
  const plotHeight = HEIGHT - MARGIN.top - MARGIN.bottom;
  const scaleX = (value) => MARGIN.left + ((value - x0) / (x1 - x0)) * plotWidth;
  const scaleY = (value) => HEIGHT - MARGIN.bottom - ((value - y0) / (y1 - y0)) * plotHeight;

  return (
    <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} className="chart">
      {ticks([x0, x1]).map((tick) => (
        <g key={`x${tick}`}>
          <line className="grid" x1={scaleX(tick)} x2={scaleX(tick)}
                y1={MARGIN.top} y2={HEIGHT - MARGIN.bottom} />
          <text x={scaleX(tick)} y={HEIGHT - MARGIN.bottom + 18} textAnchor="middle">
            {format(tick)}
          </text>
        </g>
      ))}
      {ticks([y0, y1]).map((tick) => (
        <g key={`y${tick}`}>
          <line className="grid" x1={MARGIN.left} x2={WIDTH - MARGIN.right}
                y1={scaleY(tick)} y2={scaleY(tick)} />
          <text x={MARGIN.left - 8} y={scaleY(tick) + 4} textAnchor="end">{format(tick)}</text>
        </g>
      ))}
      <line className="axis" x1={MARGIN.left} x2={WIDTH - MARGIN.right}
            y1={HEIGHT - MARGIN.bottom} y2={HEIGHT - MARGIN.bottom} />
      <line className="axis" x1={MARGIN.left} x2={MARGIN.left}
            y1={MARGIN.top} y2={HEIGHT - MARGIN.bottom} />
      <text x={WIDTH / 2} y={HEIGHT - 10} textAnchor="middle">Coordinates X</text>
      <text x={16} y={HEIGHT / 2} textAnchor="middle" transform={`rotate(-90 16 ${HEIGHT / 2})`}>
        Coordinates Y
      </text>
      {clusterPoints(points, scaleX, scaleY).map((cluster, index) => (
        <ClusterMark key={index} cluster={cluster}
                     onClick={() => onSelect(cluster.members.map((member) => member.id))} />
      ))}
    </svg>
  );
}
