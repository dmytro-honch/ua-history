import type { EraConfig } from 'data/config/eras';
import { EraSelector } from './EraSelector';
import { TimelineSlider } from './TimelineSlider';

interface TimelineControlsProps {
  timeline: UseTimelineResult;
  lang: 'uk' | 'en';
}

interface UseTimelineResult {
  era: EraConfig;
  year: number;
  setEra: (eraId: string) => void;
  setYear: (year: number) => void;
  stepForward: () => void;
  stepBackward: () => void;
  formatYear: (year: number) => string;
}

export function TimelineControls({ timeline, lang }: TimelineControlsProps) {
  const { era, year, setEra, setYear, stepForward, stepBackward, formatYear } = timeline;

  return (
    <div className="timeline-controls">
      <EraSelector currentEra={era} onChange={setEra} lang={lang} />

      <div className="timeline-controls__slider-wrapper">
        <button onClick={stepBackward} disabled={year <= era.startYear} className="timeline-controls__btn">
          ←
        </button>

        <TimelineSlider era={era} year={year} onChange={setYear} formatYear={formatYear} />

        <button onClick={stepForward} disabled={year >= era.endYear} className="timeline-controls__btn">
          →
        </button>
      </div>
    </div>
  );
}
