import { useEffect, useRef } from 'react';

export default function PrototypeNoticeModal({ onClose, onBackToRecommendations }) {
  const panelRef = useRef(null);
  const backRef = useRef(null);

  useEffect(() => {
    const previouslyFocused = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    backRef.current?.focus({ preventScroll: true });

    const panel = panelRef.current;
    if (!panel) return undefined;

    const getFocusableElements = () =>
      Array.from(
        panel.querySelectorAll(
          'button:not([disabled]), [href], [tabindex]:not([tabindex="-1"])',
        ),
      ).filter((element) => element instanceof HTMLElement);

    const handleKeyDown = (keyboardEvent) => {
      if (keyboardEvent.key === 'Escape') {
        keyboardEvent.stopPropagation();
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
    return () => {
      panel.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = previousOverflow;
      if (previouslyFocused instanceof HTMLElement) {
        previouslyFocused.focus({ preventScroll: true });
      }
    };
  }, [onClose]);

  return (
    <div
      className="modal modal--prototype"
      role="presentation"
      onClick={onClose}
    >
      <div
        ref={panelRef}
        className="modal__panel modal__panel--prototype"
        role="dialog"
        aria-modal="true"
        aria-labelledby="prototype-notice-title"
        onClick={(clickEvent) => clickEvent.stopPropagation()}
      >
        <h2 id="prototype-notice-title" className="modal__prototype-title">
          Prototype experience
        </h2>
        <p className="modal__prototype-body">
          This experience is part of the Do Different MVP and exists to validate the discovery
          experience.
        </p>
        <p className="modal__prototype-body">
          It is not a real bookable event yet.
        </p>
        <button
          ref={backRef}
          type="button"
          className="btn-primary modal__prototype-cta"
          onClick={onBackToRecommendations}
        >
          Back to recommendations
        </button>
      </div>
    </div>
  );
}
