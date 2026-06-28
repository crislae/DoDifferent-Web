import { useMemo, useState, useCallback, useEffect, useRef } from 'react';
import {
  getWhenOptions,
  PURPOSE_OPTIONS,
  DISTANCE_OPTIONS,
  COMPANION_OPTIONS,
  BUDGET_OPTIONS,
  DISCOVERY_STEPS,
} from '../utils/discoveryOptions';
import { getStepIcon } from '../utils/discoveryIcons';
import { buildDiscoverySentence } from '../utils/discoverySentence';
import {
  readDiscoveryProgress,
  saveDiscoveryProgress,
  COMPLETE_INTENT_STEPS,
} from '../utils/discoveryProgress';
import DiscoveryThinking from './DiscoveryThinking';
import DiscoveryRevealPrompt from './DiscoveryRevealPrompt';
import ImageSlideshow from './ImageSlideshow';
import { DISCOVERY_SLIDESHOW_IMAGES } from '../data/siteImages';

function resolveInitialStep() {
  const saved = readDiscoveryProgress();
  if (saved >= COMPLETE_INTENT_STEPS) {
    return COMPLETE_INTENT_STEPS;
  }
  return saved;
}

function resolveInitialPhase(step) {
  if (step >= COMPLETE_INTENT_STEPS) {
    return 'ready';
  }
  return 'questions';
}

const EXIT_MS = 380;

function OptionButton({ label, onClick, icon: Icon }) {
  return (
    <button type="button" className="discovery__option" onClick={onClick}>
      {Icon && (
        <span className="discovery__option-icon" aria-hidden="true">
          <Icon size={18} strokeWidth={1.75} />
        </span>
      )}
      <span>{label}</span>
    </button>
  );
}

function ActiveQuestion({ question, exiting, questionRef, stepIcon: StepIcon, children }) {
  return (
    <div
      className={`discovery__active${exiting ? ' discovery__active--exit' : ' discovery__active--enter'}`}
    >
      {StepIcon && (
        <div className="discovery__step-icon" aria-hidden="true">
          <StepIcon size={22} strokeWidth={1.5} />
        </div>
      )}
      <p ref={questionRef} className="discovery__question" tabIndex={-1}>
        {question}
      </p>
      <div className="discovery__options" role="radiogroup" aria-label={question}>
        {children}
      </div>
    </div>
  );
}

export default function DiscoveryPanel({
  intent,
  updateIntent,
  setIntentFields,
  onViewResults,
  onRestartDiscovery,
  focusToken = 0,
}) {
  const whenOptions = useMemo(() => getWhenOptions(), []);
  const [step, setStep] = useState(resolveInitialStep);
  const [exiting, setExiting] = useState(false);
  const [phase, setPhase] = useState(() => resolveInitialPhase(resolveInitialStep()));
  const questionRef = useRef(null);

  const isComplete = step >= DISCOVERY_STEPS.length;
  const current = !isComplete ? DISCOVERY_STEPS[step] : null;
  const answeredCount = step;
  const sentence = useMemo(
    () => buildDiscoverySentence(intent, whenOptions, answeredCount),
    [intent, whenOptions, answeredCount],
  );

  const advance = useCallback((nextStep, onSettled) => {
    setExiting(true);
    window.setTimeout(() => {
      setStep(nextStep);
      saveDiscoveryProgress(nextStep);
      setExiting(false);
      onSettled?.();
    }, EXIT_MS);
  }, []);

  const handlePurpose = (option) => {
    setIntentFields(option.intent);
    advance(step + 1);
  };

  const handleWhen = (value) => {
    updateIntent('when', value);
    advance(step + 1);
  };

  const handleDistance = (value) => {
    updateIntent('distance', value);
    advance(step + 1);
  };

  const handleWith = (value) => {
    updateIntent('with', value);
    advance(step + 1);
  };

  const handleBudget = (value) => {
    updateIntent('budget', value);
    advance(step + 1, () => setPhase('thinking'));
  };

  const handleSentenceClick = () => {
    if (exiting) return;
    onRestartDiscovery?.();
    setStep(0);
    saveDiscoveryProgress(0);
    setPhase('questions');
  };

  const StepIcon = current ? getStepIcon(current.icon) : null;
  const isFlowComplete = phase !== 'questions';

  useEffect(() => {
    if (phase === 'questions' && !exiting && current && questionRef.current) {
      questionRef.current.focus({ preventScroll: true });
    }
  }, [step, exiting, current, phase]);

  useEffect(() => {
    if (step >= COMPLETE_INTENT_STEPS && phase === 'questions') {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- resume thinking after session restore
      setPhase('thinking');
    }
  }, [step, phase]);

  useEffect(() => {
    if (!focusToken) return undefined;

    const frame = window.requestAnimationFrame(() => {
      if (phase === 'questions' && questionRef.current) {
        questionRef.current.focus({ preventScroll: true });
      }
    });

    return () => window.cancelAnimationFrame(frame);
  }, [focusToken, phase]);

  const renderOptions = () => {
    if (!current) return null;

    switch (current.id) {
      case 'purpose':
        return PURPOSE_OPTIONS.map((option) => (
          <OptionButton
            key={option.label}
            label={option.label}
            icon={getStepIcon('sparkles')}
            onClick={() => handlePurpose(option)}
          />
        ));
      case 'when':
        return whenOptions.map((option) => (
          <OptionButton
            key={option.label}
            label={option.label}
            icon={getStepIcon('calendar')}
            onClick={() => handleWhen(option.value)}
          />
        ));
      case 'distance':
        return DISTANCE_OPTIONS.map((option) => (
          <OptionButton
            key={option.value}
            label={option.label}
            icon={getStepIcon('map-pin')}
            onClick={() => handleDistance(option.value)}
          />
        ));
      case 'with':
        return COMPANION_OPTIONS.map((option) => (
          <OptionButton
            key={option.value}
            label={option.label}
            icon={getStepIcon('users')}
            onClick={() => handleWith(option.value)}
          />
        ));
      case 'budget':
        return BUDGET_OPTIONS.map((option) => (
          <OptionButton
            key={option.value}
            label={option.label}
            icon={getStepIcon('wallet')}
            onClick={() => handleBudget(option.value)}
          />
        ));
      default:
        return null;
    }
  };

  return (
    <section
      className="story-stage story-stage--discovery"
      aria-label="Discover experiences"
      id="discovery"
    >
      <div className={`discovery-deck${isFlowComplete ? ' discovery-deck--complete' : ''}`}>
        <figure className="discovery-deck__media" aria-label="Scenes from curated experiences">
          <ImageSlideshow
            images={DISCOVERY_SLIDESHOW_IMAGES}
            intervalMs={4000}
            className="discovery-deck__image"
          />
        </figure>

        <header className="discovery-deck__header">
          <h2 className="discovery-deck__title">Tell us what you&apos;re in the mood for.</h2>
          <p className="discovery-deck__sub">
            A few quick choices help us find experiences that feel right for today.
          </p>
        </header>

        <div className="discovery-deck__questionnaire">
          <div className="discovery__interaction">
            {phase === 'questions' && current && (
              <ActiveQuestion
                question={current.question}
                exiting={exiting}
                questionRef={questionRef}
                stepIcon={StepIcon}
              >
                {renderOptions()}
              </ActiveQuestion>
            )}
          </div>
        </div>

        <div className="discovery-deck__story">
          <h3 className="discovery-deck__story-title">What you&apos;re looking for</h3>
          <div className="discovery-deck__story-body">
            <div className="discovery__sentence-slot" aria-live="polite">
              {sentence && (
                <button
                  type="button"
                  className="discovery__sentence"
                  onClick={handleSentenceClick}
                  disabled={exiting}
                  aria-label="Change your answers — start the discovery again from the beginning"
                >
                  {sentence}
                </button>
              )}
            </div>

            {phase === 'thinking' && (
              <DiscoveryThinking onReady={() => setPhase('ready')} />
            )}

            {phase === 'ready' && (
              <DiscoveryRevealPrompt onReveal={onViewResults} />
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
