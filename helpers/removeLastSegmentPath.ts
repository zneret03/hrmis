export const removeLastSegment = (path: string): string =>
  path.split('/').slice(0, -1).join('/');
