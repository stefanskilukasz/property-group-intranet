export type BenefitTier = 'all' | 'manager';

export interface IBenefitFunding {
  role: string;
  amount: string;
  note: string;
}

export interface IBenefitTableRow {
  label: string;
  sub: string;
  cells: string[];
}

export interface IBenefitTable {
  note: string;
  cols: string[];
  rows: IBenefitTableRow[];
}

export interface IBenefitAddon {
  name: string;
  parts: string[];
}

export interface IBenefitDoc {
  label: string;
  href?: string;
}

export interface IBenefit {
  id: string;
  tier: BenefitTier;
  icon: string;
  title: string;
  kw: string;
  short: string;
  chips: string[];
  desc: string;
  funding?: IBenefitFunding[];
  table?: IBenefitTable;
  addons?: IBenefitAddon[];
  steps: string[];
  docs: IBenefitDoc[];
  contact?: string;
  owner: string;
  cta: string;
}
