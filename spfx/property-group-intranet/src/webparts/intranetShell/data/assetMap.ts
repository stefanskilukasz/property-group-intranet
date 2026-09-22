import officeMeeting from '../assets/office-meeting-dextarstudio.jpg';
import officeTeam from '../assets/office-team-silverkblack.jpg';

/**
 * pages.seed.json still has the prototype export's relative paths
 * (`./assets/xxx.jpg`), which don't resolve through webpack. Map the ones
 * that correspond to real, already-migrated assets to their bundled URL;
 * anything else falls back to the block's slotLabel (see ImageSlot in
 * components/blocks/Blocks.tsx).
 */
export const ASSET_MAP: Record<string, string> = {
  './assets/office-meeting-dextarstudio.jpg': officeMeeting,
  './assets/office-team-silverkblack.jpg': officeTeam
};

export function resolveAssetSrc(rawSrc: string | undefined): string | undefined {
  if (!rawSrc) {
    return undefined;
  }
  return ASSET_MAP[rawSrc];
}
