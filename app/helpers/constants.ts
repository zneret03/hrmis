export const biometricsStatus: { [key: string]: string } = {
  1: 'Fingerprint',
  15: 'Tampered'
}

export const awardTypeCast: { [key: string]: string } = {
  perfect_attendance: 'Perfect Attendance',
  lowest_absent: 'Lowest Absent',
  lowest_tardy: 'Lowest Tardiness/Late',
  loyalty_award: 'Loyalty Award'
}

export const cardStatus: { [key: string]: string } = {
  pending: 'bg-blue-500',
  approved: 'bg-green-500',
  disapproved: 'bg-red-500',
  cancelled: 'bg-red-500'
}
