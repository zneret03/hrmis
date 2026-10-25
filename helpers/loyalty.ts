// Loyalty award logic — the TypeScript mirror of the get_loyalty_award_statistics
// SQL function (see the loyalty_exact_year_thresholds migration). Awards are
// granted only in the exact milestone year; the default thresholds match the
// seeded employee_loyalty_threshold table.
export const LOYALTY_THRESHOLDS = [5, 10, 15, 20, 25, 30, 35, 40];

export const NOT_ELIGIBLE_LABEL = 'Not eligible this year';

/**
 * True only when `years` of service equals a configured milestone exactly
 * (e.g. 10/15/.../40). 11, 14, 16, 41 are not award years.
 */
export function isLoyaltyAwardYear(
  years: number,
  thresholds: number[] = LOYALTY_THRESHOLDS,
): boolean {
  return Number.isInteger(years) && thresholds.includes(years);
}

/**
 * The bracket label for a given years-of-service, matching the SQL output
 * ("<n> years loyalty award" or "Not eligible this year").
 */
export function loyaltyBracket(
  years: number,
  thresholds: number[] = LOYALTY_THRESHOLDS,
): string {
  return isLoyaltyAwardYear(years, thresholds)
    ? `${years} years loyalty award`
    : NOT_ELIGIBLE_LABEL;
}
