/**
 * Block content schema, ported from the prototype's `PAGES`/`blocks[]`
 * structure (design/Intranet Property Group.dc.html). See
 * scripts/extract-pages.js for how pages.seed.json was generated.
 *
 * Only the block types actually rendered by GenericPage have a typed shape
 * below (stats, textimage, list, brands, fields, quote, values, banner,
 * cards, text). The rest (timeline, gmap, officemap, people, depts, posts,
 * calgrid, outlook, video, enova, kbsearch, copilot) fall through to
 * UnsupportedBlock until a later stage builds them — kept as
 * `Record<string, unknown>` so the raw data still round-trips.
 */

export interface IStatItem {
  value: string;
  label: string;
}
export interface IStatsBlock {
  type: 'stats';
  items: IStatItem[];
}

export interface ITextImageBlock {
  type: 'textimage';
  title?: string;
  slotId?: string;
  slotLabel?: string;
  slotSrc?: string;
  paras: string[];
}

export interface IListItem {
  icon?: string;
  title: string;
  meta?: string;
  action?: string;
  href?: string;
  to?: string;
}
export interface IListBlock {
  type: 'list';
  title?: string;
  items: IListItem[];
}

export interface IBrandsBlock {
  type: 'brands';
  title?: string;
}

export interface IFieldItem {
  label: string;
  value: string;
}
export interface IFieldsBlock {
  type: 'fields';
  title?: string;
  slotId?: string;
  slotLabel?: string;
  items: IFieldItem[];
}

export interface IQuotePerson {
  name: string;
  role: string;
}
export interface IQuoteBlock {
  type: 'quote';
  title?: string;
  intro?: string;
  quote: string;
  by?: string;
  people?: IQuotePerson[];
}

export interface IValueItem {
  icon?: string;
  title: string;
  desc: string;
}
export interface IValuesBlock {
  type: 'values';
  title?: string;
  items: IValueItem[];
}

export interface IBannerBlock {
  type: 'banner';
  slotId?: string;
  slotLabel?: string;
  slotSrc?: string;
  caption?: string;
}

export interface ICardItem {
  icon?: string;
  title: string;
  desc?: string;
  meta?: string;
  href?: string;
  to?: string;
  ribbon?: string;
}
export interface ICardsBlock {
  type: 'cards';
  title?: string;
  varied?: boolean;
  items: ICardItem[];
}

export interface ITextBlock {
  type: 'text';
  title?: string;
  paras: string[];
}

export interface IKbSearchBlock {
  type: 'kbsearch';
  title?: string;
  kbFollowupNote?: string;
  kbNoMatchNote?: string;
}

export interface IUnsupportedBlock {
  type: string;
  [key: string]: unknown;
}

export type IPageBlock =
  | IStatsBlock
  | ITextImageBlock
  | IListBlock
  | IBrandsBlock
  | IFieldsBlock
  | IQuoteBlock
  | IValuesBlock
  | IBannerBlock
  | ICardsBlock
  | ITextBlock
  | IKbSearchBlock
  | IUnsupportedBlock;

export interface IPageData {
  badge?: string;
  title: string;
  lead?: string;
  blocks: IPageBlock[];
  footerTitle?: string;
  footerText?: string;
  footerCta?: string;
}

export interface IBrandChannel {
  label: string;
  href: string;
}
export interface IBrand {
  name: string;
  desc: string;
  owner: string;
  url: string;
  urlLabel: string;
  channels: IBrandChannel[];
}
