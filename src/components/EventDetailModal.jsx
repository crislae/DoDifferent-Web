import { useEffect, useRef, useState } from 'react';
import { X } from 'lucide-react';
import { HORSE_BARN_ALT, HORSE_BARN_IMAGE } from '../data/siteImages';
import PrototypeNoticeModal from './PrototypeNoticeModal';

function formatIntensity(value) {
  if (!value) return null;
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function MetaRow({ label, value }) {
  if (!value) return null;

  return (
    <>
      <dt className="modal__meta-label">{label}</dt>
      <dd className="modal__meta-value">{value}</dd>
    </>
  );
}

export default function EventDetailModal({
  event,
  matchReasons = [],
  isLoved = false,
  onLove,
  onDismiss,
  onClose,
}) {
  const closeRef = useRef(null);
  const panelRef = useRef(null);
  const [showPrototypeNotice, setShowPrototypeNotice] = useState(false);

  useEffect(() => {
    setShowPrototypeNotice(false);
  }, [event]);

  useEffect(() => {
    if (!event) return undefined;

    const previouslyFocused = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    if (!showPrototypeNotice) {
      closeRef.current?.focus({ preventScroll: true });
    }

    return () => {
      document.body.style.overflow = previousOverflow;
      if (previouslyFocused instanceof HTMLElement) {
        previouslyFocused.focus({ preventScroll: true });
      }
    };
  }, [event, showPrototypeNotice]);

  useEffect(() => {
    if (!event || showPrototypeNotice) return undefined;

    const panel = panelRef.current;
    if (!panel) return undefined;

    const getFocusableElements = () =>
      Array.from(
        panel.querySelectorAll(
          'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
        ),
      ).filter((element) => element instanceof HTMLElement);

    const handleKeyDown = (keyboardEvent) => {
      if (keyboardEvent.key === 'Escape') {
        onClose();
        return;
      }

      if (keyboardEvent.key !== 'Tab') return;

      const focusable = getFocusableElements();
      if (!focusable.length) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (keyboardEvent.shiftKey && document.activeElement === first) {
        keyboardEvent.preventDefault();
        last.focus();
      } else if (!keyboardEvent.shiftKey && document.activeElement === last) {
        keyboardEvent.preventDefault();
        first.focus();
      }
    };

    panel.addEventListener('keydown', handleKeyDown);
    return () => panel.removeEventListener('keydown', handleKeyDown);
  }, [event, onClose, showPrototypeNotice]);

  if (!event) return null;

  const handleBackToRecommendations = () => {
    setShowPrototypeNotice(false);
    onClose();
  };

  if (showPrototypeNotice) {
    return (
      <PrototypeNoticeModal
        onClose={() => setShowPrototypeNotice(false)}
        onBackToRecommendations={handleBackToRecommendations}
      />
    );
  }

  const { metadata = {} } = event;
  const languages = metadata.language?.length ? metadata.language.join(', ') : null;

  return (
    <div
      className="modal"
      role="presentation"
      onClick={onClose}
    >
      <div
        ref={panelRef}
        className="modal__panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby="event-detail-title"
        onClick={(clickEvent) => clickEvent.stopPropagation()}
      >
        <button
          ref={closeRef}
          type="button"
          className="modal__close"
          onClick={onClose}
          aria-label="Close"
        >
          <X size={20} strokeWidth={1.75} aria-hidden="true" />
        </button>

        <div className="modal__media">
          <img
            className="modal__image"
            src={HORSE_BARN_IMAGE}
            alt={HORSE_BARN_ALT}
          />
        </div>

        <div className="modal__content">
          <header className="modal__header">
            <h2 id="event-detail-title" className="modal__title">
              {event.title}
            </h2>
            <p className="modal__hook">{event.emotionalHook}</p>
          </header>

          <ul className="modal__logistics" aria-label="Event details">
            <li>{event.location}</li>
            <li>{event.dateDuration}</li>
            <li>{event.budget}</li>
          </ul>

          {event.tags?.length > 0 && (
            <ul className="modal__tags" aria-label="Tags">
              {event.tags.map((tag) => (
                <li key={tag} className="modal__tag">
                  {tag}
                </li>
              ))}
            </ul>
          )}

          {event.providerName && (
            <p className="modal__provider">Hosted by {event.providerName}</p>
          )}

          {(metadata.intensity ||
            metadata.groupSize ||
            languages ||
            metadata.bestFor) && (
            <dl className="modal__meta">
              <MetaRow label="Intensity" value={formatIntensity(metadata.intensity)} />
              <MetaRow label="Group size" value={metadata.groupSize} />
              <MetaRow label="Languages" value={languages} />
              <MetaRow label="Best for" value={metadata.bestFor} />
            </dl>
          )}

          {matchReasons?.length > 0 && (
            <div className="modal__thought">
              <p className="modal__thought-label">Why we thought of this</p>
              <ul className="modal__thought-list">
                {matchReasons.map((reason) => (
                  <li key={reason} className="modal__thought-text">
                    {reason}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="modal__actions">
            <button
              type="button"
              className="btn-primary modal__cta-primary"
              onClick={() => setShowPrototypeNotice(true)}
            >
              Open provider page
            </button>

            {onLove && (
              <button
                type="button"
                className={`modal__cta-secondary modal__cta-love${isLoved ? ' modal__cta-love--loved' : ''}`}
                onClick={() => onLove(event.id)}
                aria-pressed={isLoved}
                aria-label={isLoved ? 'Remove loved status' : 'Love it'}
              >
                {isLoved ? '❤️ Loved' : '❤️ Love it'}
              </button>
            )}

            {onDismiss && (
              <button
                type="button"
                className="modal__cta-secondary modal__cta-dismiss"
                onClick={() => onDismiss(event.id)}
                aria-label="Not for me"
              >
                Not for me
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
