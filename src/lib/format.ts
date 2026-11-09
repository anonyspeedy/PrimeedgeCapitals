export const money = (value: number, fraction = 2) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: fraction,
    maximumFractionDigits: fraction,
  }).format(value);

export const compact = (value: number) =>
  new Intl.NumberFormat('en-US', { notation: 'compact', maximumFractionDigits: 1 }).format(value);

export const moneyCompact = (value: number) => `$${compact(value)}`;

export const pct = (value: number, fraction = 0) => `${value.toFixed(fraction)}%`;

export const clamp = (value: number, min = 0, max = 100) => Math.min(max, Math.max(min, value));

/** SVG path for the mini sparkline / equity charts. */
export function sparkPath(values: number[], width = 120, height = 36) {
  if (values.length < 2) return '';
  const min = Math.min(...values);
  const max = Math.max(...values);
  const span = max - min || 1;
  const stepX = width / (values.length - 1);
  return values
    .map((value, index) => {
      const x = (index * stepX).toFixed(2);
      const y = (height - ((value - min) / span) * height).toFixed(2);
      return `${index === 0 ? 'M' : 'L'}${x},${y}`;
    })
    .join(' ');
}
