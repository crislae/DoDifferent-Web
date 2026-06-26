import { useState, useEffect } from 'react';
import { Brain } from 'lucide-react';

const MESSAGES = [
  'Reading what you shared…',
  'Looking for little gems…',
  'Finding experiences worth your time…',
  "We think you'll love these.",
];

const PHRASE_MS = 1400;
const FADE_MS = 300;

export default function DiscoveryThinking({ onReady }) {
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (index >= MESSAGES.length - 1) {
      const readyTimer = window.setTimeout(() => onReady(), PHRASE_MS);
      return () => window.clearTimeout(readyTimer);
    }

    const fadeTimer = window.setTimeout(() => setVisible(false), PHRASE_MS - FADE_MS);
    const nextTimer = window.setTimeout(() => {
      setIndex((current) => current + 1);
      setVisible(true);
    }, PHRASE_MS);

    return () => {
      window.clearTimeout(fadeTimer);
      window.clearTimeout(nextTimer);
    };
  }, [index, onReady]);

  return (
    <div className="discovery-thinking" aria-live="polite">
      <div className="discovery-thinking__icon" aria-hidden="true">
        <Brain size={32} strokeWidth={1.5} className="discovery-thinking__sparkle" />
      </div>
      <p
        className={`discovery-thinking__text${visible ? ' discovery-thinking__text--visible' : ''}`}
      >
        {MESSAGES[index]}
      </p>
    </div>
  );
}
