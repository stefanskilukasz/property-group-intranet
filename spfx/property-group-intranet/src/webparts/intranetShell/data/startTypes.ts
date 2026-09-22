export interface INewsItem {
  id: string;
  cat: string;
  priority?: boolean;
  meta: string;
  readTime: string;
  title: string;
  excerpt: string;
  quote?: string;
  quoteBy?: string;
}

export interface IReactionDef {
  key: string;
  label: string;
  icon: string;
}

export interface IEvent {
  id: string;
  day: string;
  month: string;
  title: string;
  meta: string;
  start: string;
  end: string;
  location: string;
  desc: string;
}

export interface IShortcutDef {
  key: string;
  label: string;
  href?: string;
  to?: string;
}

export interface IKbEntry {
  q: string;
  a: string;
  kw: string;
}
