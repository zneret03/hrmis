export const LEAVE_CARD_MIN_YEAR = 1900;

export const leaveCardYearError = (
  currentYear = new Date().getFullYear(),
): string => `Year must be between ${LEAVE_CARD_MIN_YEAR} and ${currentYear}.`;

/** A leave-card entry's year: a whole year from 1900 up to the current year. */
export const isValidLeaveCardYear = (
  year: string,
  currentYear = new Date().getFullYear(),
): boolean => {
  const value = Number(year);
  return (
    year.trim() !== '' &&
    Number.isInteger(value) &&
    value >= LEAVE_CARD_MIN_YEAR &&
    value <= currentYear
  );
};
