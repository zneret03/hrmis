/**
 * Select options plus the current value when it is not among them (e.g. legacy
 * free text), so editing an old record never silently drops its value.
 */
export const withCurrentOption = (
  options: readonly string[],
  current?: string | null,
): string[] =>
  current && !options.includes(current) ? [...options, current] : [...options];
