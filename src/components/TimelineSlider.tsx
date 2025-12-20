import type { EraConfig } from 'data/config/eras';

interface TimelineSliderProps {
  era: EraConfig;
  year: number;
  onChange: (year: number) => void;
  formatYear: (year: number) => string;
}

export function TimelineSlider({ era, year, onChange, formatYear }: TimelineSliderProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(parseInt(e.target.value, 10));
  };

  const totalSteps = Math.floor((era.endYear - era.startYear) / era.step);

  return (
    <div className="timeline-slider">
      <span className="timeline-slider__label timeline-slider__label--start">{formatYear(era.startYear)}</span>

      <input type="range" min={era.startYear} max={era.endYear} step={era.step} value={year} onChange={handleChange} className="timeline-slider__input" />

      <span className="timeline-slider__label timeline-slider__label--end">{formatYear(era.endYear)}</span>

      <div className="timeline-slider__current">{formatYear(year)}</div>
    </div>
  );
}
