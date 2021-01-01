const DAY = 86400e3;

export function formatRequestTime(date) {
  const now = Date.now();
  const time = Math.floor((now - date.getTime()) / DAY);

  if (time < 0.2) return 'Just now';
  if (time < 1) return `${time * 24} Hours Ago`;
  if (time < 30) return `${time} Days Ago`;

  return `${Math.floor(time / 30)} Months Ago`;
}
