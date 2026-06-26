import { ChevronDown } from 'lucide-react';
import { scrollToSection } from '../utils/scrollToSection';

export default function ScrollCue({
  targetId,
  label = 'Continue',
  inline = false,
  scrollerRef = null,
}) {
  const handleClick = () => {
    scrollToSection(targetId, 'smooth', scrollerRef);
  };

  return (
    <button
      type="button"
      className={`scroll-cue${inline ? ' scroll-cue--inline' : ''}`}
      onClick={handleClick}
      aria-label={`${label}: scroll to next section`}
    >
      <ChevronDown size={22} strokeWidth={1.75} aria-hidden="true" />
    </button>
  );
}
