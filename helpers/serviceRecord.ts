export const DATE_RANGE_ERROR = 'From date must be on or before the To date.';

/**
 * Service-record periods are open-ended when From or To is missing ("To" empty
 * = Present). ISO dates (yyyy-mm-dd) compare correctly as strings.
 */
export const isValidDateRange = (
  from?: string | null,
  to?: string | null,
): boolean => !from || !to || from <= to;
