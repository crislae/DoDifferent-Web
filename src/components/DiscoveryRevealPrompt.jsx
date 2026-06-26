import { Sparkles, ChevronDown } from 'lucide-react';

export default function DiscoveryRevealPrompt({ onReveal }) {
  return (
    <div className="discovery-reveal">
      <p className="discovery-reveal__hint">Your picks are ready whenever you are.</p>
      <button
        type="button"
        className="discovery-reveal__btn"
        onClick={onReveal}
      >
        <span className="discovery-reveal__btn-icon" aria-hidden="true">
          <Sparkles size={20} strokeWidth={1.75} />
        </span>
        <span className="discovery-reveal__btn-label">See your picks</span>
        <span className="discovery-reveal__btn-cue" aria-hidden="true">
          <ChevronDown size={18} strokeWidth={2} />
        </span>
      </button>
    </div>
  );
}
