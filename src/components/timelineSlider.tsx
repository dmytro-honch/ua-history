import { type EraConfig } from 'data/config/eras';
import { Range } from './formElements/range';
import { useRef, useState } from 'react';

interface TimelineSliderProps {
  era: EraConfig;
  year: number;
  onChange: (year: number) => void;
  formatYear: (year: number) => string;
  wrapperWidth: number | null | undefined;
}

export function TimelineSlider({ era, year, onChange, formatYear, wrapperWidth }: TimelineSliderProps) {
  const [highlight, setHighlight] = useState<{ from: number; to: number } | null>({ from: 1932, to: 1933 });
  const wrapperRef = useRef<HTMLDivElement>(null);

  console.log('wrapperWidth', wrapperWidth);

  return (
    <div className="timeline-slider">
      <span className="timeline-slider__label">{formatYear(era.startYear)}</span>
      <div className="timeline-slider__input--wrapper" ref={wrapperRef}>
        <Range
          start={era.startYear}
          end={era.endYear}
          step={era.step}
          year={year}
          onChange={onChange}
          formatYear={formatYear}
          highlight={highlight}
          width={wrapperRef.current?.clientWidth || 0}
        />
      </div>
      <span className="timeline-slider__label">{formatYear(era.endYear)}</span>
    </div>
  );
}
