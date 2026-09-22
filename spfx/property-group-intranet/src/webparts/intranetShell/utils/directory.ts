import staffRowsJson from '../data/pages.seed.json';
import { IStaffMember, IPionGroup, IDeptSummary, IDeptCount } from '../data/directoryTypes';

const staffRows = staffRowsJson.staffRows as [string, string, string, string, string][];

/** { Z: 'Zarząd', DG: 'Dyrektor Generalny', SM: 'Sprzedaż i Marketing' } — ported from the prototype's PION map. */
export const PION_NAMES: Record<string, string> = {
  Z: 'Zarząd',
  DG: 'Dyrektor Generalny',
  SM: 'Sprzedaż i Marketing'
};

/** Ported from the prototype's people(): STAFF tuples -> typed staff records. */
export function getStaff(): IStaffMember[] {
  return staffRows.map((r, i) => ({
    id: 'st' + i,
    name: r[0],
    role: r[1],
    dept: r[2],
    team: r[3],
    pion: r[4],
    initials: r[0].split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase(),
    isBoard: r[4] === 'Z'
  }));
}

function deptPion(staff: IStaffMember[], dept: string): string {
  const first = staff.filter(p => p.dept === dept)[0];
  return first ? first.pion : 'DG';
}

/** Ported from the prototype's deptGroups(): pion -> departments, each with head/headcount/teams. */
export function getDeptGroups(): IPionGroup[] {
  const staff = getStaff();
  const order = ['DG', 'SM'];
  const heads: Record<string, string> = { DG: 'Piotr Wetmański', SM: 'Jerzy Michalski' };

  return order.map(pk => {
    const seen: string[] = [];
    staff.forEach(p => {
      if (!p.isBoard && p.dept !== 'Zarząd' && seen.indexOf(p.dept) < 0 && deptPion(staff, p.dept) === pk) {
        seen.push(p.dept);
      }
    });
    const depts: IDeptSummary[] = seen.map(d => {
      const deptStaff = staff.filter(p => p.dept === d);
      const teams: string[] = [];
      deptStaff.forEach(p => { if (p.team !== d && teams.indexOf(p.team) < 0) teams.push(p.team); });
      return {
        name: d,
        head: deptStaff[0].name,
        headRole: deptStaff[0].role,
        count: deptStaff.length,
        teams: teams.join(' · ') || 'jeden zespół'
      };
    }).sort((a, b) => b.count - a.count);

    return { pion: PION_NAMES[pk], head: heads[pk], count: depts.reduce((n, d) => n + d.count, 0), depts };
  });
}

/** Ported from the prototype's deptList(): flat department -> headcount, for the directory filter dropdown. */
export function getDeptList(): IDeptCount[] {
  const staff = getStaff();
  const map: Record<string, number> = {};
  staff.forEach(p => { if (!p.isBoard) { map[p.dept] = (map[p.dept] || 0) + 1; } });
  return Object.keys(map).map(d => ({ name: d, count: map[d] })).sort((a, b) => b.count - a.count);
}
