const DAY = 86400e3;

export function formatRequestTime(timestamp: number | Date) {
  if (timestamp instanceof Date) {
    timestamp = timestamp.getTime();
  }
  const now = Date.now();
  const time = (now - timestamp) / DAY;

  if (time < 0.2) return 'Just now';
  if (time < 1) return `${Math.floor(time * 24)} Hours Ago`;
  if (time < 30) return `${Math.floor(time)} Days Ago`;

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
