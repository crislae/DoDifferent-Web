import { ChevronDown } from 'lucide-react';
import { scrollToSection } from '../utils/scrollToSection';
import { getContinueAriaLabel } from '../data/slides';

export default function ScrollCue({
  targetId,
  label = 'next section',
  inline = false,
  className = '',
  scrollerRef = null,
  onNavigate = null,
}) {
  const handleClick = () => {
    if (onNavigate) {
      onNavigate();
      return;
    }

    scrollToSection(targetId, 'smooth', scrollerRef);
  };

  return (
    <button
      type="button"
      className={`scroll-cue${inline ? ' scroll-cue--inline' : ''}${className ? ` ${className}` : ''}`}
      onClick={handleClick}
      aria-label={getContinueAriaLabel(label)}
    >
      <ChevronDown size={22} strokeWidth={1.75} aria-hidden="true" />
    </button>
  );
}
