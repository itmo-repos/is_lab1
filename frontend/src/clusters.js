export function radius(count) {
  return count === 1 ? 8 : Math.min(40, 12 + 4 * Math.sqrt(count));
}

export function clusterPoints(points, scaleX, scaleY) {
  const clusters = points.map((point) => ({
    x: scaleX(point.x),
    y: scaleY(point.y),
    members: [point],
  }));
  let merged = true;
  while (merged) {
    merged = false;
    for (let i = 0; i < clusters.length && !merged; i++) {
      for (let j = i + 1; j < clusters.length && !merged; j++) {
        const a = clusters[i];
        const b = clusters[j];
        const distance = Math.hypot(a.x - b.x, a.y - b.y);
        if (distance < radius(a.members.length) + radius(b.members.length)) {
          const total = a.members.length + b.members.length;
          a.x = (a.x * a.members.length + b.x * b.members.length) / total;
          a.y = (a.y * a.members.length + b.y * b.members.length) / total;
          a.members = [...a.members, ...b.members];
          clusters.splice(j, 1);
          merged = true;
        }
      }
    }
  }
  return clusters;
}
