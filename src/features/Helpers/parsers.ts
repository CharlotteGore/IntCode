export const toLines = (str: string) => str.split(/\n/g);
export const lsvToIntArray = (str: string) =>
  str.split(/\n/g).map(m => parseInt(m, 10));
export const toIntArray = (str: string) =>
  Array.from(str).map(m => parseInt(m));
export const csvToIntArray = (str: string) =>
  str.split(/,/g).map(m => parseInt(m, 10));
export const linesToRegex = (str: string, rex: RegExp) =>
  str.split(/\n/g).map(m => m.match(rex));
