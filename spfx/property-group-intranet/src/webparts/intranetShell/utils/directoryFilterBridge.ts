/**
 * Small one-shot bridge so a department chip elsewhere (Struktura's depts
 * block, a person card, a place in the office map) can deep-link into the
 * staff directory (`zespol`) pre-filtered, without threading extra
 * navigation params through every block's onNavigate prop.
 *
 * Not app state: StaffDirectoryPage consumes and clears it once, on the
 * next time the `zespol` route mounts.
 */
export interface IDirectoryFilter {
  dept?: string;
  query?: string;
}

let pending: IDirectoryFilter | undefined;

export function setDirectoryFilter(filter: IDirectoryFilter): void {
  pending = filter;
}

export function consumeDirectoryFilter(): IDirectoryFilter | undefined {
  const value = pending;
  pending = undefined;
  return value;
}
