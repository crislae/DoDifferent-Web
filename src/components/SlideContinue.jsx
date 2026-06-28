import ScrollCue from './ScrollCue';

export default function SlideContinue({
  nextLabel,
  nextId,
  hint = null,
  onNavigate = null,
  className = '',
}) {
  if (!nextLabel || !nextId) return null;

  return (
    <div className={`slide-continue${className ? ` ${className}` : ''}`}>
      {hint ? <p className="slide-continue__hint">{hint}</p> : null}

      <ScrollCue
        targetId={nextId}
        label={nextLabel}
        inline
        className="slide-continue__cue"
        onNavigate={onNavigate}
      />
    </div>
  );
}
