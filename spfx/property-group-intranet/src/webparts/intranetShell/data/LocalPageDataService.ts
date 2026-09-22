import { IPageDataService } from './IPageDataService';
import { IPageData, IBrand, ITextImageBlock, IBannerBlock } from './pageTypes';
import { INewsItem, IEvent, IShortcutDef, IReactionDef, IKbEntry } from './startTypes';
import { IBenefit } from './benefitsTypes';
import { IPlace, IStreet } from './directoryTypes';
import { resolveAssetSrc } from './assetMap';
import seed from './pages.seed.json';

function withResolvedAssets(page: IPageData): IPageData {
  return {
    ...page,
    blocks: page.blocks.map(block => {
      if (block.type === 'textimage' || block.type === 'banner') {
        const imageBlock = block as ITextImageBlock | IBannerBlock;
        return { ...imageBlock, slotSrc: resolveAssetSrc(imageBlock.slotSrc) };
      }
      return block;
    })
  };
}

const rawPages = seed.pages as Record<string, IPageData>;
const pages: Record<string, IPageData> = {};
Object.keys(rawPages).forEach(route => {
  pages[route] = withResolvedAssets(rawPages[route]);
});
const brands = seed.brands as IBrand[];
const news = seed.news as INewsItem[];
const reactionDefs = seed.reactionDefs as IReactionDef[];
const events = seed.events as IEvent[];
const shortcutCatalog = seed.shortcutCatalog as IShortcutDef[];
const shortcutDefault = seed.shortcutDefault as string[];
const kbEntries = seed.kbEntries as IKbEntry[];
const benefits = seed.benefits as IBenefit[];
const places = seed.places as IPlace[];
const streets = seed.streets as IStreet[];

export class LocalPageDataService implements IPageDataService {
  public getPage(route: string): IPageData | undefined {
    return pages[route];
  }

  public getBrands(): IBrand[] {
    return brands;
  }

  public getNews(): INewsItem[] {
    return news;
  }

  public getReactionDefs(): IReactionDef[] {
    return reactionDefs;
  }

  public getEvents(): IEvent[] {
    return events;
  }

  public getShortcutCatalog(): IShortcutDef[] {
    return shortcutCatalog;
  }

  public getDefaultShortcutKeys(): string[] {
    return shortcutDefault;
  }

  public getKbEntries(): IKbEntry[] {
    return kbEntries;
  }

  public getBenefits(): IBenefit[] {
    return benefits;
  }

  public getPlaces(): IPlace[] {
    return places;
  }

  public getStreets(): IStreet[] {
    return streets;
  }
}
