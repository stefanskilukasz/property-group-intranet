import * as React from 'react';
import Icon from '../../design/Icon';
import {
  ITimelineBlock, IPostsBlock, IVideoBlock, IEnovaBlock, IGmapBlock, IPeopleBlock, ICopilotBlock
} from '../../data/pageTypes';
import { INewsItem, IReactionDef } from '../../data/startTypes';
import NewsFeed from '../Start/NewsFeed';
import styles from './MoreBlocks.module.scss';

export const TimelineBlock: React.FunctionComponent<{ block: ITimelineBlock }> = ({ block }) => (
  <div className={styles.timelineBlock}>
    {block.title && <h3 className={styles.blockTitle}>{block.title}</h3>}
    <ol className={styles.timeline}>
      {block.items.map((item, i) => (
        <li key={i} className={styles.timelineItem}>
          <div className={styles.timelineYear}>{item.year}</div>
          <div className={styles.timelineDot} />
          <div className={styles.timelineBody}>
            <div className={styles.timelineTitle}>{item.title}</div>
            <p className={styles.timelineText}>{item.text}</p>
          </div>
        </li>
      ))}
    </ol>
  </div>
);

export const PostsBlock: React.FunctionComponent<{ block: IPostsBlock; news: INewsItem[]; reactionDefs: IReactionDef[] }> = ({ block, news, reactionDefs }) => (
  <div className={styles.postsBlock}>
    {block.title && <h3 className={styles.blockTitle}>{block.title}</h3>}
    <NewsFeed items={news} reactionDefs={reactionDefs} />
  </div>
);

export const VideoBlock: React.FunctionComponent<{ block: IVideoBlock }> = ({ block }) => (
  <div className={styles.videoBlock}>
    <div className={styles.videoHeader}>
      <div>
        {block.videoTitle && <h3 className={styles.blockTitle}>{block.videoTitle}</h3>}
        {block.videoNote && <p className={styles.videoNote}>{block.videoNote}</p>}
      </div>
      {block.videoHref && (
        <a href={block.videoHref} target="_blank" rel="noreferrer" className={styles.videoChannelLink}>Otwórz kanał</a>
      )}
    </div>
    <div className={styles.videoGrid}>
      {block.videos.map((v, i) => (
        <div key={v.id} className={styles.videoCard}>
          <div className={styles.videoEmbed}>
            <iframe
              src={`https://www.youtube.com/embed/${v.id}`}
              title={v.title}
              loading={i === 0 ? 'eager' : 'lazy'}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
          <div className={styles.videoCardTitle}>{v.title}</div>
          <div className={styles.videoCardDate}>{v.date}</div>
        </div>
      ))}
    </div>
  </div>
);

export const EnovaBlock: React.FunctionComponent<{ block: IEnovaBlock }> = ({ block }) => (
  <div className={styles.enovaBlock}>
    {block.title && <h3 className={styles.blockTitle}>{block.title}</h3>}
    {block.note && <p className={styles.enovaNote}>{block.note}</p>}
    <div className={styles.enovaGrid}>
      {block.items.map((item, i) => (
        <a key={i} href={item.href} target="_blank" rel="noreferrer" className={styles.enovaCard}>
          {item.title}
        </a>
      ))}
    </div>
  </div>
);

export const GmapBlock: React.FunctionComponent<{ block: IGmapBlock }> = ({ block }) => (
  <div className={styles.gmapBlock}>
    {block.title && <h3 className={styles.blockTitle}>{block.title}</h3>}
    {block.addr && <p className={styles.gmapAddr}>{block.addr}</p>}
    {block.embed && (
      <div className={styles.gmapEmbed}>
        <iframe src={block.embed} title={block.title || 'Mapa'} loading="lazy" />
      </div>
    )}
    <div className={styles.gmapActions}>
      {block.mapsHref && <a href={block.mapsHref} target="_blank" rel="noreferrer" className={styles.gmapAction}>Otwórz w Mapach Google</a>}
      {block.routeHref && <a href={block.routeHref} target="_blank" rel="noreferrer" className={styles.gmapAction}>Wyznacz trasę</a>}
    </div>
  </div>
);

export const PeopleBlock: React.FunctionComponent<{ block: IPeopleBlock }> = ({ block }) => (
  <div className={styles.peopleBlock}>
    {block.title && <h3 className={styles.blockTitle}>{block.title}</h3>}
    {block.note && <p className={styles.peopleNote}>{block.note}</p>}
    <div className={styles.peopleGrid}>
      {block.items.map((p, i) => {
        const initials = p.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
        const content = (
          <>
            <div className={styles.avatar}>{initials}</div>
            <div>
              <div className={styles.personName}>{p.name}</div>
              <div className={styles.personRole}>{p.role}</div>
            </div>
          </>
        );
        return p.href
          ? <a key={i} href={p.href} className={`${styles.personCard} ${styles.personCardLink}`}>{content}</a>
          : <div key={i} className={styles.personCard}>{content}</div>;
      })}
    </div>
  </div>
);

/**
 * Static preview of example Copilot prompts/answers — per docs/design-handoff.md
 * this block is *meant* to show worked examples ("Poniżej podgląd na
 * przykładach") while flagging that the real integration doesn't exist yet,
 * unlike `outlook` which docs say should show no data at all.
 */
export const CopilotBlock: React.FunctionComponent<{ block: ICopilotBlock }> = ({ block }) => (
  <div className={styles.copilotBlock}>
    <div className={styles.copilotHeader}>
      <Icon name="spark" size={20} className={styles.copilotIcon} />
      <div>
        {block.title && <h3 className={styles.blockTitle}>{block.title}</h3>}
        {block.intro && <p className={styles.copilotIntro}>{block.intro}</p>}
      </div>
    </div>
    <div className={styles.copilotPrompts}>
      {block.prompts.map((p, i) => (
        <div key={i} className={styles.copilotPrompt}>
          <div className={styles.copilotQ}>{p.q}</div>
          <div className={styles.copilotA}>{p.a}</div>
        </div>
      ))}
    </div>
  </div>
);
