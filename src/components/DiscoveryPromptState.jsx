export default function DiscoveryPromptState({ onStartDiscovery }) {
  return (
    <div className="empty-state">
      <div className="empty-state__content">
        <h3 className="empty-state__title">Let&apos;s find experiences that fit you.</h3>
        <p className="empty-state__text">
          Answer five quick questions and we&apos;ll curate recommendations based on what
          you&apos;re looking for today.
        </p>
        <button type="button" className="empty-state__btn" onClick={onStartDiscovery}>
          Start discovery
        </button>
      </div>
    </div>
  );
}
