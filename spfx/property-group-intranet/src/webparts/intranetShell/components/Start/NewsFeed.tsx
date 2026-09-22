import * as React from 'react';
import Icon from '../../design/Icon';
import { INewsItem, IReactionDef } from '../../data/startTypes';
import styles from './NewsFeed.module.scss';

export interface INewsFeedProps {
  items: INewsItem[];
  reactionDefs: IReactionDef[];
}

interface IComment {
  id: string;
  author: string;
  text: string;
}

type ReactionCounts = Record<string, number>;
type ReactionState = Record<string, ReactionCounts>;
type MyReactions = Record<string, string | undefined>;

function emptyReactions(items: INewsItem[], defs: IReactionDef[]): ReactionState {
  const state: ReactionState = {};
  items.forEach(item => {
    const counts: ReactionCounts = {};
    defs.forEach(d => { counts[d.key] = 0; });
    state[item.id] = counts;
  });
  return state;
}

const NewsCard: React.FunctionComponent<{
  item: INewsItem;
  hero: boolean;
  reactionDefs: IReactionDef[];
  counts: ReactionCounts;
  myReaction: string | undefined;
  onReact: (key: string) => void;
  comments: IComment[];
  onAddComment: (text: string) => void;
}> = ({ item, hero, reactionDefs, counts, myReaction, onReact, comments, onAddComment }) => {
  const [commentDraft, setCommentDraft] = React.useState('');
  const [showComments, setShowComments] = React.useState(false);

  const submitComment = (e: React.FormEvent): void => {
    e.preventDefault();
    const text = commentDraft.trim();
    if (!text) {
      return;
    }
    onAddComment(text);
    setCommentDraft('');
  };

  return (
    <article className={`${styles.card} ${hero ? styles.cardHero : ''}`}>
      <div className={styles.meta}>
        <span className={styles.cat}>{item.cat}</span>
        <span className={styles.metaText}>{item.meta} · {item.readTime}</span>
      </div>
      {item.photo && <img src={item.photo} alt="" className={hero ? styles.heroPhoto : styles.photo} />}
      <h3 className={hero ? styles.heroTitle : styles.title}>{item.title}</h3>
      <p className={styles.excerpt}>{item.excerpt}</p>
      {item.quote && (
        <blockquote className={styles.quote}>
          {item.quote}
          {item.quoteBy && <footer className={styles.quoteBy}>{item.quoteBy}</footer>}
        </blockquote>
      )}

      <div className={styles.actions}>
        <div className={styles.reactions}>
          {reactionDefs.map(def => (
            <button
              key={def.key}
              type="button"
              className={`${styles.reactionButton} ${myReaction === def.key ? styles.reactionButtonActive : ''}`}
              onClick={() => onReact(def.key)}
            >
              <Icon name={def.icon} size={14} />
              {counts[def.key] || 0}
            </button>
          ))}
        </div>
        <button type="button" className={styles.commentsToggle} onClick={() => setShowComments(v => !v)}>
          {comments.length} {comments.length === 1 ? 'komentarz' : 'komentarze'}
        </button>
      </div>

      {showComments && (
        <div className={styles.comments}>
          {comments.map(c => (
            <div key={c.id} className={styles.comment}>
              <span className={styles.commentAuthor}>{c.author}</span>
              <span>{c.text}</span>
            </div>
          ))}
          <form className={styles.commentForm} onSubmit={submitComment}>
            <input
              type="text"
              value={commentDraft}
              onChange={e => setCommentDraft(e.target.value)}
              placeholder="Napisz komentarz…"
              className={styles.commentInput}
            />
            <button type="submit" className={styles.commentSubmit}>Wyślij</button>
          </form>
        </div>
      )}
    </article>
  );
};

/**
 * Priority hero post + lighter list, 3 fixed reaction types (one per user,
 * re-click toggles), flat unthreaded comments — per docs/design-handoff.md.
 * Reactions/comments are in-memory only here, same as the prototype; a
 * SharePoint-backed version would write to a list instead.
 */
const NewsFeed: React.FunctionComponent<INewsFeedProps> = ({ items, reactionDefs }) => {
  const [reactionCounts, setReactionCounts] = React.useState<ReactionState>(() => emptyReactions(items, reactionDefs));
  const [myReactions, setMyReactions] = React.useState<MyReactions>({});
  const [comments, setComments] = React.useState<Record<string, IComment[]>>({});

  const react = (itemId: string, key: string): void => {
    setMyReactions(prev => {
      const current = prev[itemId];
      const next = current === key ? undefined : key;

      setReactionCounts(counts => {
        const itemCounts = { ...counts[itemId] };
        if (current) {
          itemCounts[current] = Math.max(0, (itemCounts[current] || 0) - 1);
        }
        if (next) {
          itemCounts[next] = (itemCounts[next] || 0) + 1;
        }
        return { ...counts, [itemId]: itemCounts };
      });

      return { ...prev, [itemId]: next };
    });
  };

  const addComment = (itemId: string, text: string): void => {
    setComments(prev => ({
      ...prev,
      [itemId]: [...(prev[itemId] || []), { id: itemId + '-' + Date.now(), author: 'Ty', text }]
    }));
  };

  const [hero, ...rest] = items;

  return (
    <div className={styles.feed}>
      {hero && (
        <NewsCard
          item={hero}
          hero
          reactionDefs={reactionDefs}
          counts={reactionCounts[hero.id] || {}}
          myReaction={myReactions[hero.id]}
          onReact={key => react(hero.id, key)}
          comments={comments[hero.id] || []}
          onAddComment={text => addComment(hero.id, text)}
        />
      )}
      {rest.map(item => (
        <NewsCard
          key={item.id}
          item={item}
          hero={false}
          reactionDefs={reactionDefs}
          counts={reactionCounts[item.id] || {}}
          myReaction={myReactions[item.id]}
          onReact={key => react(item.id, key)}
          comments={comments[item.id] || []}
          onAddComment={text => addComment(item.id, text)}
        />
      ))}
    </div>
  );
};

export default NewsFeed;
