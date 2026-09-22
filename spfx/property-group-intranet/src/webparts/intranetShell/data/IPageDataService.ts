import { IPageData, IBrand } from './pageTypes';
import { INewsItem, IEvent, IShortcutDef, IReactionDef } from './startTypes';

/**
 * Abstraction over where page content comes from. `LocalPageDataService`
 * (this stage) reads the extracted prototype copy; a future
 * `SharePointPageDataService` will read the `IntranetPages` list instead
 * (per the architecture plan — content editors shouldn't need a redeploy
 * to change copy). Consumers depend only on this interface.
 */
export interface IPageDataService {
  getPage(route: string): IPageData | undefined;
  getBrands(): IBrand[];
  getNews(): INewsItem[];
  getReactionDefs(): IReactionDef[];
  getEvents(): IEvent[];
  getShortcutCatalog(): IShortcutDef[];
  getDefaultShortcutKeys(): string[];
}
