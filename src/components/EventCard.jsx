export default function EventCard({
  event,
  matchReasons,
  isLoved,
  onLove,
  onTellMore,
  onDismiss,
  compact = false,
}) {
  return (
    <article className="event-card">
      <div className="event-card__body">
        <header className="event-card__header">
          <h3 className="event-card__title">{event.title}</h3>
          <p className="event-card__hook">{event.emotionalHook}</p>
        </header>

        <p className="event-card__logistics">
          {event.location} · {event.dateDuration} · {event.budget}
        </p>

        <ul className="event-card__tags" aria-label="Tags">
          {event.tags.map((tag) => (
            <li key={tag} className="event-card__tag">
              {tag}
            </li>
          ))}
        </ul>

        {!compact && matchReasons?.length > 0 && (
          <div className="event-card__thought">
            <span className="event-card__thought-label">Why we thought of this</span>
            <ul className="event-card__thought-list">
              {matchReasons.map((reason) => (
                <li key={reason} className="event-card__thought-text">
                  {reason}
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="event-card__actions">
          <button
            type="button"
            className={`event-card__btn event-card__btn--love${isLoved ? ' event-card__btn--loved' : ''}`}
            onClick={() => onLove(event.id)}
            aria-pressed={isLoved}
            aria-label={isLoved ? 'Loved' : 'Love it'}
          >
            {isLoved ? '👍 Loved' : '👍 Love it'}
          </button>
          <button
            type="button"
            className="event-card__btn event-card__btn--dismiss"
            onClick={() => onDismiss(event.id)}
            aria-label="Not for me"
          >
            👎 Not for me
          </button>
          <button
            type="button"
            className="event-card__btn event-card__btn--more"
            onClick={() => onTellMore(event)}
            aria-label="Tell me more"
          >
            ✨ Tell me more
          </button>
        </div>
      </div>
    </article>
  );
}
