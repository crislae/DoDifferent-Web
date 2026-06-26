export default function PickyMoodCard({ onChangeMood, onShowGems, canShowGems = true }) {
  return (
    <article className="picky-mood-card">
      <h3 className="picky-mood-card__title">Hmm... your mood is being picky today.</h3>
      <p className="picky-mood-card__body">
        We couldn&apos;t find anything else that feels right.
        <br />
        Want to try another direction?
      </p>
      <div className="picky-mood-card__actions">
        <button type="button" className="picky-mood-card__btn picky-mood-card__btn--primary" onClick={onChangeMood}>
          Change my mood
        </button>
        <button
          type="button"
          className="picky-mood-card__btn"
          onClick={onShowGems}
          disabled={!canShowGems}
        >
          Show popular gems
        </button>
      </div>
    </article>
  );
}
