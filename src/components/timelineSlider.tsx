import { type EraConfig } from '@/config/eras';
import { Range } from './formElements/range';
import { useState } from 'react';

interface TimelineSliderProps {
  era: EraConfig;
  year: number;
  onChange: (year: number) => void;
  wrapperWidth: number | null | undefined;
  bcPostfix: string;
  acPostfix: string;
}

export function TimelineSlider({ era, year, onChange, wrapperWidth, bcPostfix, acPostfix }: TimelineSliderProps) {
  const [highlight] = useState<{ from: number; to: number } | null>({ from: 1932, to: 1933 });

  console.log('wrapperWidth', wrapperWidth);

  return (
    <Range
      start={era.startYear}
      end={era.endYear}
      step={era.step}
      year={year}
      onChange={onChange}
      highlight={highlight}
      width={window.innerWidth || 0}
      bcPostfix={bcPostfix}
      acPostfix={acPostfix}
    />
  );
}
