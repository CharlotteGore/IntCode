export const toLines = (str: string) => str.split(/\n/g);
export const lsvToIntArray = (str: string) =>
  str.split(/\n/g).map(m => parseInt(m, 10)).filter(n => Number.isNaN(n) === false);;
export const toIntArray = (str: string) =>
  Array.from(str).map(m => parseInt(m)).filter(n => Number.isNaN(n) === false);;
export const csvToIntArray = (str: string) => 
  str.split(/,/g).map(m => parseInt(m, 10)).filter(n => Number.isNaN(n) === false);

export const linesToRegex = (str: string, rex: RegExp) =>
  str.split(/\n/g).map(m => m.match(rex));
