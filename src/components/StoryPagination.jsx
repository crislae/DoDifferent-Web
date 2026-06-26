const SECTION_LABELS = {
  intro: 'Welcome',
  curated: 'Why trust us',
  trust: 'Our promise',
  discovery: 'Discovery',
  matches: 'Your matches',
  gems: 'Worth Discovering',
  footer: 'Footer',
};

export default function StoryPagination({ sections, activeIndex, onSelect }) {
  if (!sections.length) return null;

  return (
    <nav className="story-pagination" aria-label="Section navigation">
      <ol className="story-pagination__list">
        {sections.map((sectionId, index) => (
          <li key={sectionId}>
            <button
              type="button"
              className={`story-pagination__dot${index === activeIndex ? ' story-pagination__dot--active' : ''}`}
              onClick={() => onSelect(index)}
              aria-label={SECTION_LABELS[sectionId] ?? `Section ${index + 1}`}
              aria-current={index === activeIndex ? 'true' : undefined}
            />
          </li>
        ))}
      </ol>
    </nav>
  );
}
