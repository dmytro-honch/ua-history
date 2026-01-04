import { useEffect, useRef, useState } from 'react';
import { EraSelector } from './eraSelector';
import { TimelineSlider } from './timelineSlider';
import { useTimeline } from '@/hooks/useTimeline';

interface TimelineControlsProps {
  timeline: ReturnType<typeof useTimeline>;
  lang: 'ua' | 'en';
  bcPostfix: string;
  acPostfix: string;
}

export function TimelineControls({ timeline, lang, bcPostfix, acPostfix }: TimelineControlsProps) {
  const { era, year, setEra, setYear, stepForward, stepBackward, formatYear } = timeline;
  const [wrapperWidth, setWrapperWidth] = useState(0);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>;

    const updateWidth = () => {
      const w = wrapperRef.current?.clientWidth || 0;
      if (w > 0) setWrapperWidth(w);
    };

    const debouncedUpdate = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(updateWidth, 50);
    };

    updateWidth();

    const observer = new ResizeObserver(debouncedUpdate);
    if (wrapperRef.current) {
      observer.observe(wrapperRef.current);
    }

    window.addEventListener('resize', debouncedUpdate);

    return () => {
      clearTimeout(timeoutId);
      observer.disconnect();
      window.removeEventListener('resize', debouncedUpdate);
    };
  }, []);

  return (
    <div className="timeline-controls" ref={wrapperRef}>
      <EraSelector currentEra={era} onChange={setEra} lang={lang} />

      <div className="timeline-controls__slider-wrapper">
        <div className="timeline-slider__current">{formatYear(year, bcPostfix, acPostfix)}</div>
        <button onClick={stepBackward} disabled={year <= era.startYear} className="timeline-controls__btn">
          ←
        </button>

        <TimelineSlider era={era} year={year} onChange={setYear} formatYear={(year) => formatYear(year, bcPostfix, acPostfix)} wrapperWidth={wrapperWidth} />

        <button onClick={stepForward} disabled={year >= era.endYear} className="timeline-controls__btn">
          →
        </button>
      </div>
    </div>
  );
}
