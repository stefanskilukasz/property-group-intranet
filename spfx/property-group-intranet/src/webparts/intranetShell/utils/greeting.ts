import seed from '../data/pages.seed.json';

const VOC_EXC: Record<string, string> = seed.vocativeExceptions;

/**
 * Polish vocative case for a first name, e.g. "Adam" -> "Adamie". Ported
 * verbatim from the prototype (design/Intranet Property Group.dc.html),
 * which explicitly notes this function is meant to be reused as-is on the
 * SPFx side. Not a complete Polish grammar engine — falls back to a
 * reasonable heuristic for names not in the exceptions dictionary.
 */
export function vocative(displayName: string | undefined): string {
  const first = String(displayName || '').trim().split(/\s+/)[0];
  if (!first) {
    return '';
  }
  const low = first.toLocaleLowerCase('pl');
  const cap = (v: string): string => v.charAt(0).toLocaleUpperCase('pl') + v.slice(1);

  if (VOC_EXC[low]) {
    return cap(VOC_EXC[low]);
  }
  const last = low.slice(-1);
  const last2 = low.slice(-2);
  if (last2 === 'ia' || last2 === 'ja') return cap(low.slice(0, -1) + 'u');
  if (last === 'a') return cap(low.slice(0, -1) + 'o');
  if (last === 'y' || last === 'i') return cap(low);
  if ('szżźcćdżl'.indexOf(last) >= 0 || last2 === 'sz' || last2 === 'cz') return cap(low + 'u');
  if (last === 'k' || last === 'g') return cap(low + 'u');
  return cap(low + 'ie');
}

export function greetingForHour(hour: number): string {
  if (hour < 5) return 'Dobrej nocy';
  if (hour < 18) return 'Dzień dobry';
  return 'Dobry wieczór';
}
