export const capitalizeFirstLetterWord = (val: string): string =>
  String(val).charAt(0).toUpperCase() + String(val).slice(1);
