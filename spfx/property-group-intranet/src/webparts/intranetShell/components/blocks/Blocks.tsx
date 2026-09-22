import * as React from 'react';
import Icon from '../../design/Icon';
import {
  IPageBlock, IStatsBlock, ITextImageBlock, IListBlock, IBrandsBlock,
  IFieldsBlock, IQuoteBlock, IValuesBlock, IBannerBlock, ICardsBlock, ITextBlock,
  IKbSearchBlock, IBrand
} from '../../data/pageTypes';
import { IKbEntry } from '../../data/startTypes';
import { normalizeForSearch } from '../../utils/text';
import styles from './Blocks.module.scss';

/**
 * A list/card action can point at an external URL (`href`) or an internal
 * route (`to`) — renders as a real link either way instead of silently
 * dropping the action when only `to` is set.
 */
const ActionLink: React.FunctionComponent<{
  href?: string;
  to?: string;
  onNavigate: (route: string) => void;
  className?: string;
  children: React.ReactNode;
}> = ({ href, to, onNavigate, className, children }) => {
  if (href) {
    return <a href={href} target="_blank" rel="noreferrer" className={className}>{children}</a>;
  }
  if (to) {
    return <button type="button" className={className} onClick={() => onNavigate(to)}>{children}</button>;
  }
  return null;
};

const StatsBlock: React.FunctionComponent<{ block: IStatsBlock }> = ({ block }) => (
  <div className={styles.stats}>
    {block.items.map((item, i) => (
      <div key={i} className={styles.statItem}>
        <div className={styles.statValue}>{item.value}</div>
        <div className={styles.statLabel}>{item.label}</div>
      </div>
    ))}
  </div>
);

/**
 * CLAUDE.md: every photo-background element needs a background-color
 * fallback for a broken/missing image URL — the prototype's asset paths
 * (`./assets/...`) aren't wired into the SPFx build yet, so this is not
 * hypothetical.
 */
const ImageSlot: React.FunctionComponent<{ src?: string; label?: string }> = ({ src, label }) => {
  const [failed, setFailed] = React.useState(false);
  const showImage = !!src && !failed;
  return (
    <div className={styles.imageSlot} style={{ backgroundColor: '#F1D1FF' }}>
      {showImage
        ? <img src={src} alt={label || ''} className={styles.image} onError={() => setFailed(true)} />
        : <span className={styles.imageSlotLabel}>{label || 'Zdjęcie'}</span>}
    </div>
  );
};

const TextImageBlock: React.FunctionComponent<{ block: ITextImageBlock }> = ({ block }) => (
  <div className={styles.textImage}>
    <div className={styles.textImageBody}>
      {block.title && <h3 className={styles.blockTitle}>{block.title}</h3>}
      {block.paras.map((p, i) => <p key={i} className={styles.para}>{p}</p>)}
    </div>
    <ImageSlot src={block.slotSrc} label={block.slotLabel} />
  </div>
);

const ListBlock: React.FunctionComponent<{ block: IListBlock; onNavigate: (route: string) => void }> = ({ block, onNavigate }) => (
  <div className={styles.listBlock}>
    {block.title && <h3 className={styles.blockTitle}>{block.title}</h3>}
    <ul className={styles.list}>
      {block.items.map((item, i) => (
        <li key={i} className={styles.listItem}>
          {item.icon && <Icon name={item.icon} size={18} className={styles.listIcon} />}
          <div className={styles.listItemBody}>
            <div className={styles.listItemTitle}>{item.title}</div>
            {item.meta && <div className={styles.listItemMeta}>{item.meta}</div>}
          </div>
          <ActionLink href={item.href} to={item.to} onNavigate={onNavigate} className={styles.listItemAction}>
            {item.action || 'Otwórz'}
          </ActionLink>
        </li>
      ))}
    </ul>
  </div>
);

const BrandCard: React.FunctionComponent<{ brand: IBrand }> = ({ brand }) => (
  <div className={styles.brandCard}>
    <div className={styles.brandName}>{brand.name}</div>
    <p className={styles.brandDesc}>{brand.desc}</p>
    <a href={brand.url} target="_blank" rel="noreferrer" className={styles.brandUrl}>{brand.urlLabel}</a>
  </div>
);

const BrandsBlock: React.FunctionComponent<{ block: IBrandsBlock; brands: IBrand[] }> = ({ block, brands }) => (
  <div className={styles.brandsBlock}>
    {block.title && <h3 className={styles.blockTitle}>{block.title}</h3>}
    <div className={styles.brandsGrid}>
      {brands.map((b, i) => <BrandCard key={i} brand={b} />)}
    </div>
  </div>
);

const FieldsBlock: React.FunctionComponent<{ block: IFieldsBlock }> = ({ block }) => (
  <div className={styles.fieldsBlock}>
    {block.title && <h3 className={styles.blockTitle}>{block.title}</h3>}
    <dl className={styles.fieldsList}>
      {block.items.map((item, i) => (
        <div key={i} className={styles.fieldRow}>
          <dt className={styles.fieldLabel}>{item.label}</dt>
          <dd className={styles.fieldValue}>{item.value}</dd>
        </div>
      ))}
    </dl>
  </div>
);

const QuoteBlock: React.FunctionComponent<{ block: IQuoteBlock }> = ({ block }) => (
  <div className={styles.quoteBlock}>
    {block.title && <h3 className={styles.blockTitle}>{block.title}</h3>}
    {block.intro && <p className={styles.para}>{block.intro}</p>}
    <blockquote className={styles.quote}>{block.quote}</blockquote>
    {block.by && <div className={styles.quoteBy}>{block.by}</div>}
    {block.people && (
      <div className={styles.quotePeople}>
        {block.people.map((p, i) => (
          <div key={i} className={styles.quotePerson}>
            <div className={styles.quotePersonName}>{p.name}</div>
            <div className={styles.quotePersonRole}>{p.role}</div>
          </div>
        ))}
      </div>
    )}
  </div>
);

const ValuesBlock: React.FunctionComponent<{ block: IValuesBlock }> = ({ block }) => (
  <div className={styles.valuesBlock}>
    {block.title && <h3 className={styles.blockTitle}>{block.title}</h3>}
    <div className={styles.valuesGrid}>
      {block.items.map((item, i) => (
        <div key={i} className={styles.valueItem}>
          {item.icon && <Icon name={item.icon} size={22} className={styles.valueIcon} />}
          <div className={styles.valueTitle}>{item.title}</div>
          <p className={styles.valueDesc}>{item.desc}</p>
        </div>
      ))}
    </div>
  </div>
);

const BannerBlock: React.FunctionComponent<{ block: IBannerBlock }> = ({ block }) => (
  <div className={styles.banner}>
    <ImageSlot src={block.slotSrc} label={block.slotLabel} />
    {block.caption && <p className={styles.bannerCaption}>{block.caption}</p>}
  </div>
);

const CardsBlock: React.FunctionComponent<{ block: ICardsBlock; onNavigate: (route: string) => void }> = ({ block, onNavigate }) => (
  <div className={styles.cardsBlock}>
    {block.title && <h3 className={styles.blockTitle}>{block.title}</h3>}
    <div className={styles.cardsGrid}>
      {block.items.map((item, i) => (
        <ActionLink key={i} href={item.href} to={item.to} onNavigate={onNavigate} className={styles.card}>
          {item.ribbon && <span className={styles.cardRibbon}>{item.ribbon}</span>}
          {item.icon && <Icon name={item.icon} size={20} className={styles.cardIcon} />}
          <div className={styles.cardTitle}>{item.title}</div>
          {item.desc && <p className={styles.cardDesc}>{item.desc}</p>}
          {item.meta && <div className={styles.cardMeta}>{item.meta}</div>}
        </ActionLink>
      ))}
    </div>
  </div>
);

const TextBlock: React.FunctionComponent<{ block: ITextBlock }> = ({ block }) => (
  <div className={styles.textBlock}>
    {block.title && <h3 className={styles.blockTitle}>{block.title}</h3>}
    {block.paras.map((p, i) => <p key={i} className={styles.para}>{p}</p>)}
  </div>
);

/**
 * KB-deflection search: type a problem, matching articles appear —
 * preserved as the primary path before any "open a ticket" action, per
 * docs/design-handoff.md ("preserve this order, it exists to cut ticket
 * volume"). Shows the full KB list before the user types anything.
 */
const KbSearchBlock: React.FunctionComponent<{ block: IKbSearchBlock; kbEntries: IKbEntry[] }> = ({ block, kbEntries }) => {
  const [query, setQuery] = React.useState('');
  const [openIndex, setOpenIndex] = React.useState<number | undefined>(undefined);

  const normalizedQuery = normalizeForSearch(query.trim());
  const matches = normalizedQuery
    ? kbEntries.filter(entry => normalizeForSearch(entry.q + ' ' + entry.kw).indexOf(normalizedQuery) >= 0)
    : kbEntries;

  return (
    <div className={styles.kbSearch}>
      {block.title && <h3 className={styles.blockTitle}>{block.title}</h3>}
      <div className={styles.kbInputWrap}>
        <Icon name="search" size={16} className={styles.kbInputIcon} />
        <input
          type="search"
          value={query}
          onChange={e => { setQuery(e.target.value); setOpenIndex(undefined); }}
          placeholder="Opisz problem, np. „VPN nie działa”…"
          className={styles.kbInput}
        />
      </div>

      {matches.length === 0 && (
        <p className={styles.kbNote}>{block.kbNoMatchNote || 'Nie znaleziono pasujących artykułów.'}</p>
      )}

      <ul className={styles.kbList}>
        {matches.map((entry, i) => {
          const open = openIndex === i;
          return (
            <li key={i} className={styles.kbItem}>
              <button
                type="button"
                className={styles.kbQuestion}
                onClick={() => setOpenIndex(open ? undefined : i)}
                aria-expanded={open}
              >
                {entry.q}
              </button>
              {open && <p className={styles.kbAnswer}>{entry.a}</p>}
            </li>
          );
        })}
      </ul>

      {block.kbFollowupNote && <p className={styles.kbFollowup}>{block.kbFollowupNote}</p>}
    </div>
  );
};

const UnsupportedBlock: React.FunctionComponent<{ block: IPageBlock }> = ({ block }) => (
  <div className={styles.unsupported}>
    Blok typu <code>{block.type}</code> nie został jeszcze zbudowany w wersji SPFx.
  </div>
);

export interface IBlockRendererProps {
  block: IPageBlock;
  brands: IBrand[];
  kbEntries: IKbEntry[];
  onNavigate: (route: string) => void;
}

// Casts below are needed because IUnsupportedBlock's `type: string` overlaps
// every literal in the union, so TS can't narrow `block` from `block.type`
// alone in a switch. The cast is safe: each case is reached only when
// block.type actually equals that literal.
export const BlockRenderer: React.FunctionComponent<IBlockRendererProps> = ({ block, brands, kbEntries, onNavigate }) => {
  switch (block.type) {
    case 'stats': return <StatsBlock block={block as IStatsBlock} />;
    case 'textimage': return <TextImageBlock block={block as ITextImageBlock} />;
    case 'list': return <ListBlock block={block as IListBlock} onNavigate={onNavigate} />;
    case 'brands': return <BrandsBlock block={block as IBrandsBlock} brands={brands} />;
    case 'fields': return <FieldsBlock block={block as IFieldsBlock} />;
    case 'quote': return <QuoteBlock block={block as IQuoteBlock} />;
    case 'values': return <ValuesBlock block={block as IValuesBlock} />;
    case 'banner': return <BannerBlock block={block as IBannerBlock} />;
    case 'cards': return <CardsBlock block={block as ICardsBlock} onNavigate={onNavigate} />;
    case 'text': return <TextBlock block={block as ITextBlock} />;
    case 'kbsearch': return <KbSearchBlock block={block as IKbSearchBlock} kbEntries={kbEntries} />;
    default: return <UnsupportedBlock block={block} />;
  }
};
