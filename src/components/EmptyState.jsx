export default function EmptyState({ onBroaden }) {
  return (
    <div className="empty-state">
      <div className="empty-state__content">
        <h2 className="empty-state__title">Nothing quite right yet</h2>
        <p className="empty-state__text">
          We couldn&apos;t find more experiences that strongly fit this intent.
          Try widening your distance, changing the mood, or come back when new
          experiences are curated.
        </p>
        <button type="button" className="empty-state__btn" onClick={onBroaden}>
          Broaden my intent
        </button>
      </div>
    </div>
  );
}
