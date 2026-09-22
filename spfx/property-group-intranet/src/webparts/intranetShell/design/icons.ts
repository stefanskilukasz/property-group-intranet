/**
 * SVG path data, ported from the prototype (design/Intranet Property Group.dc.html).
 * Per CLAUDE.md's "known bugs to avoid": never use emoji as icons — always SVG.
 */
export const iconPaths: Record<string, string> = {
  home: 'M4 10.6 12 4l8 6.6V19.8a1.2 1.2 0 0 1-1.2 1.2H14.5v-6h-5v6H5.2A1.2 1.2 0 0 1 4 19.8z',
  building: 'M4 21h16M6.5 21V5.2L12 3.2V21M12 9.5h5.5V21M9.2 8.4v0M9.2 12.4v0M9.2 16.4v0',
  compass: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18M15.6 8.4l-2.1 5.1-5.1 2.1 2.1-5.1z',
  chart: 'M4 20h16M7.5 16.5v-4.8M12 16.5V6.4M16.5 16.5v-3.2',
  share: 'M8.5 12a2.8 2.8 0 1 1-5.6 0 2.8 2.8 0 0 1 5.6 0M21.1 6a2.8 2.8 0 1 1-5.6 0 2.8 2.8 0 0 1 5.6 0M21.1 18a2.8 2.8 0 1 1-5.6 0 2.8 2.8 0 0 1 5.6 0M8.2 10.7l7-3.3M8.2 13.3l7 3.3',
  badge: 'M12 12.4a3.9 3.9 0 1 0 0-7.8 3.9 3.9 0 0 0 0 7.8M5 20.5v-.9a4.6 4.6 0 0 1 4.6-4.6h4.8a4.6 4.6 0 0 1 4.6 4.6v.9',
  help: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18M9.6 9.4A2.6 2.6 0 0 1 14.6 10c0 1.7-2.6 2.1-2.6 3.6M12 17.2v0',
  files: 'M13.2 3H7.4A1.4 1.4 0 0 0 6 4.4v15.2A1.4 1.4 0 0 0 7.4 21h9.2a1.4 1.4 0 0 0 1.4-1.4V7.8zM13.2 3v4.8H18M9.4 13h5.2M9.4 16.6h3.4',
  shield: 'M12 3.2 5 6v5.4c0 4.3 2.9 7.6 7 9.4 4.1-1.8 7-5.1 7-9.4V6z',
  sun: 'M12 4.2v1.6M12 18.2v1.6M4.2 12h1.6M18.2 12h1.6M6.5 6.5l1.1 1.1M16.4 16.4l1.1 1.1M17.5 6.5l-1.1 1.1M7.6 16.4l-1.1 1.1M12 16a4 4 0 1 0 0-8 4 4 0 0 0 0 8',
  moon: 'M20 14.5A8.5 8.5 0 1 1 9.5 4a6.8 6.8 0 0 0 10.5 10.5z',
  search: 'M11 4.5a6.5 6.5 0 1 0 0 13 6.5 6.5 0 0 0 0-13M20 20l-4.7-4.7',
  chevronDown: 'M6 9l6 6 6-6',
  close: 'M6 6l12 12M18 6L6 18',
  lock: 'M6.5 11V8.2a5.5 5.5 0 0 1 11 0V11M5.6 11h12.8a1.2 1.2 0 0 1 1.2 1.2v7.6a1.2 1.2 0 0 1-1.2 1.2H5.6a1.2 1.2 0 0 1-1.2-1.2v-7.6A1.2 1.2 0 0 1 5.6 11'
};

export interface IIconProps {
  name: string;
  size?: number;
  className?: string;
}
