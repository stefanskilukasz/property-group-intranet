export interface IStaffMember {
  id: string;
  name: string;
  role: string;
  dept: string;
  team: string;
  pion: string;
  initials: string;
  isBoard: boolean;
}

export interface IDeptSummary {
  name: string;
  head: string;
  headRole: string;
  count: number;
  teams: string;
}

export interface IPionGroup {
  pion: string;
  head: string;
  count: number;
  depts: IDeptSummary[];
}

export interface IDeptCount {
  name: string;
  count: number;
}

export interface IPlace {
  n: string;
  t: 'zespol' | 'sala' | 'udog';
  s: string;
  m: string;
  c?: string;
}

export interface IStreet {
  id: string;
  name: string;
  color: string;
  desc: string;
}
