export const STATUS = {
  approved: 'Approved',
  cancelled: 'Cancelled',
  new: 'New',
  rejected: 'Rejected',
  viewed: 'Viewed',
} as const;

export type Status = typeof STATUS[keyof typeof STATUS];
