import { useEffect, useState } from 'react';
import { useTimeline } from '@/hooks/useTimeline';
import { EraSelector } from './eraSelector';
import { TimelineSlider } from './timelineSlider';

interface TimelineControlsProps {
  timeline: ReturnType<typeof useTimeline>;
  bcPostfix: string;
  acPostfix: string;
}

export function TimelineControls({ timeline, bcPostfix, acPostfix }: TimelineControlsProps) {
  const { era, year, setEra, setYear, stepForward, stepBackward, formatYear } = timeline;
  const [wrapperWidth, setWrapperWidth] = useState(0);

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>;

    const updateWidth = () => {
      const width = window.innerWidth || 0;
      if (width > 0) setWrapperWidth(width);
    };

    const debouncedUpdate = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(updateWidth, 50);
    };

    updateWidth();

    window.addEventListener('resize', debouncedUpdate);

    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('resize', debouncedUpdate);
    };
  }, []);

  return (
    <div className="timeline-controls">
      <div className="timeline-controls__top-row">
        <div className="timeline-controls__era-selector">
          <EraSelector currentEra={era} onChange={setEra} />
        </div>

        <div className="timeline-controls__years">
          <button onClick={stepBackward} disabled={year <= era.startYear} className="round-button timeline-controls__btn">
            <svg
              viewBox="0 0 32 32"
              width="32"
              height="32"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M 8 16 L 25 16" strokeWidth={2} />
              <path d="M 13 11 L 8 16 L 13 21" strokeWidth={2} />
            </svg>
          </button>
          <div className="timeline-slider__current">{formatYear(year, bcPostfix, acPostfix)}</div>
          <button onClick={stepForward} disabled={year >= era.endYear} className="round-button timeline-controls__btn">
             <svg
              viewBox="0 0 32 32"
              width="32"
              height="32"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M 8 16 L 25 16" strokeWidth={2} />
              <path d="M 19 11 L 24 16 L 19 21" strokeWidth={2} />
            </svg>
          </button>
        </div>
      </div>

      <TimelineSlider era={era} year={year} onChange={setYear} formatYear={(year) => formatYear(year, bcPostfix, acPostfix)} wrapperWidth={wrapperWidth} />
    </div>
  );
}
