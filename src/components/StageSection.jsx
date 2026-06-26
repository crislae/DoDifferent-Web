import ScrollCue from './ScrollCue';

export default function StageSection({
  id,
  title,
  titleId,
  icon: Icon,
  children,
  showCue = true,
  nextTarget,
  className = '',
  ariaLabel,
  scrollerRef = null,
}) {
  return (
    <section
      id={id}
      className={`story-stage${className ? ` ${className}` : ''}`}
      aria-label={ariaLabel}
      aria-labelledby={titleId}
    >
      <div className="story-stage__inner">
        {Icon && (
          <div className="story-stage__icon" aria-hidden="true">
            <Icon size={28} strokeWidth={1.5} />
          </div>
        )}

        {title && (
          <h2 id={titleId} className="story-stage__title">
            {title}
          </h2>
        )}

        <div className="story-stage__body">{children}</div>
      </div>

      {showCue && nextTarget && (
        <ScrollCue targetId={nextTarget} scrollerRef={scrollerRef} />
      )}
    </section>
  );
}
