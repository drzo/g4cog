export function normalizeWeights(weights: Record<string, number>): Record<string, number> {
  const normalized: Record<string, number> = {};
  const values = Object.values(weights);
  const max = Math.max(...values.map(Math.abs));

  if (max === 0) return weights;

  Object.entries(weights).forEach(([key, value]) => {
    normalized[key] = value / max;
  });

  return normalized;
}

export function scaleWeights(
  weights: Record<string, number>,
  scale: number
): Record<string, number> {
  const scaled: Record<string, number> = {};
  
  Object.entries(weights).forEach(([key, value]) => {
    scaled[key] = value * scale;
  });

  return scaled;
}

export function interpolateWeights(
  weights1: Record<string, number>,
  weights2: Record<string, number>,
  t: number
): Record<string, number> {
  const interpolated: Record<string, number> = {};
  
  Object.keys(weights1).forEach(key => {
    const v1 = weights1[key];
    const v2 = weights2[key] ?? v1;
    interpolated[key] = v1 + (v2 - v1) * t;
  });

  return interpolated;
}