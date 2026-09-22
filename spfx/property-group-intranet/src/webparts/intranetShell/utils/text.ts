/** Lowercases and strips diacritics, so "łączy" matches a search for "laczy". */
export function normalizeForSearch(value: string): string {
  return value
    .toLocaleLowerCase('pl')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '');
}
