import { IPageDataService } from './IPageDataService';
import { IPageData, IBrand, ITextImageBlock, IBannerBlock } from './pageTypes';
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

export class LocalPageDataService implements IPageDataService {
  public getPage(route: string): IPageData | undefined {
    return pages[route];
  }

  public getBrands(): IBrand[] {
    return brands;
  }
}
