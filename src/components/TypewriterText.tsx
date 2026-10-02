import React, { useState, useEffect } from 'react';

export interface TypewriterTextProps {
  roles?: string[];
  typingSpeed?: number;      // ms per character forward
  deletingSpeed?: number;    // ms per character backward
  pauseDuration?: number;    // ms to pause when complete
  startDelay?: number;       // initial ms before typing starts
  nextWordDelay?: number;    // ms between finishing deletion and starting next word
  className?: string;
  textClassName?: string;
  cursorClassName?: string;
}

export const DEFAULT_HERO_ROLES = [
  'Full Stack Developer',
  'Data Scientist',
  'Machine Learning Engineer',
  'Artificial Intelligence Engineer',
  'Generative AI Developer',
  'Python Developer',
  'Data Analyst',
  'UI/UX Developer',
];

export const TypewriterText: React.FC<TypewriterTextProps> = ({
  roles = DEFAULT_HERO_ROLES,
  typingSpeed = 75,
  deletingSpeed = 38,
  pauseDuration = 1800,
  startDelay = 300,
  nextWordDelay = 300,
  className = '',
  textClassName = '',
  cursorClassName = '',
}) => {
  const [displayText, setDisplayText] = useState('');
  const [roleIndex, setRoleIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);

  // Initial delay before typing begins
  useEffect(() => {
    const timer = setTimeout(() => {
      setHasStarted(true);
    }, startDelay);
    return () => clearTimeout(timer);
  }, [startDelay]);

  // Main typing effect loop
  useEffect(() => {
    if (!hasStarted || !roles || roles.length === 0) return;

    let timeoutId: NodeJS.Timeout;
    const currentTarget = roles[roleIndex % roles.length];

    if (isPaused) {
      // Pause at full word for around 1.5 - 2 seconds
      timeoutId = setTimeout(() => {
        setIsPaused(false);
        setIsDeleting(true);
      }, pauseDuration);
    } else if (isDeleting) {
      // Smooth character deletion
      if (displayText.length > 0) {
        timeoutId = setTimeout(() => {
          setDisplayText(currentTarget.slice(0, displayText.length - 1));
        }, deletingSpeed);
      } else {
        // Complete deletion, brief polite pause before next word starts typing
        timeoutId = setTimeout(() => {
          setIsDeleting(false);
          setRoleIndex(prev => (prev + 1) % roles.length);
        }, nextWordDelay);
      }
    } else {
      // Typing forward
      if (displayText.length < currentTarget.length) {
        timeoutId = setTimeout(() => {
          setDisplayText(currentTarget.slice(0, displayText.length + 1));
        }, typingSpeed);
      } else {
        // Finished typing full word
        setIsPaused(true);
      }
    }

    return () => clearTimeout(timeoutId);
  }, [
    hasStarted,
    displayText,
    isDeleting,
    isPaused,
    roleIndex,
    roles,
    typingSpeed,
    deletingSpeed,
    pauseDuration,
    nextWordDelay,
  ]);

  const currentRole = roles[roleIndex % roles.length];

  return (
    <div
      className={`min-h-[2.5rem] sm:min-h-[2.75rem] flex items-center ${className}`}
      aria-label={`Role: ${currentRole}`}
    >
      <span
        className={`font-display font-extrabold tracking-tight text-accent-gradient inline ${textClassName}`}
      >
        {displayText}
        {/* Invisible zero-width character ensures height never collapses when displayText is empty */}
        {displayText.length === 0 && (
          <span className="opacity-0 select-none inline-block w-0" aria-hidden="true">
            &#8203;
          </span>
        )}
        <span
          aria-hidden="true"
          className={`inline-block ml-1 font-mono font-medium text-[var(--accent)] select-none text-typing-cursor ${cursorClassName}`}
        >
          |
        </span>
      </span>
    </div>
  );
};
