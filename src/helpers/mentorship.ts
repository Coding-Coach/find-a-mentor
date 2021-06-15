const DAY = 86400e3;

export function formatRequestTime(timestamp: number) {
  const now = Date.now();
  const time = Math.floor((now - timestamp) / DAY);

  if (time < 0.2) return 'Just now';
  if (time < 1) return `${time * 24} Hours Ago`;
  if (time < 30) return `${time} Days Ago`;

  return `${Math.floor(time / 30)} Months Ago`;
}

export const STATUS = {
  approved: 'Approved',
  cancelled: 'Cancelled',
  new: 'New',
  rejected: 'Rejected',
  viewed: 'Viewed',
} as const;

export type Status = typeof STATUS[keyof typeof STATUS];
