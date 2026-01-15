export interface EraConfig {
  id: string;
  name: { uk: string; en: string };
  startYear: number;
  endYear: number;
  step: number;
  periods: string[];
  territories: string[];
}

export const ERAS: EraConfig[] = [
  {
    id: 'prehistoric',
    name: { uk: 'Доісторичний період', en: 'Prehistoric' },
    startYear: -10000,
    endYear: -750,
    step: 1000,
    periods: ['trypillian', 'bronze-age', 'early-scythians'],
    territories: [],
  },
  {
    id: 'ancient',
    name: { uk: 'Античність', en: 'Ancient' },
    startYear: -750,
    endYear: 375,
    step: 100,
    periods: ['scythians', 'sarmatians', 'greek-colonies'],
    territories: ['scythia', 'bosporan-kingdom'],
  },
  {
    id: 'medieval',
    name: { uk: 'Середньовіччя', en: 'Medieval' },
    startYear: 375,
    endYear: 1500,
    step: 25,
    periods: ['kyivan-rus', 'galicia-volhynia', 'mongol-period', 'lithuanian-rule'],
    territories: ['kyivan-rus', 'galicia-volhynia', 'golden-horde'],
  },
  {
    id: 'early-modern',
    name: { uk: 'Ранній новий час', en: 'Early Modern' },
    startYear: 1500,
    endYear: 1800,
    step: 10,
    periods: ['polish-lithuanian', 'khmelnytsky', 'hetmanate', 'zaporizhian-sich'],
    territories: ['polish-lithuanian', 'hetmanate', 'ottoman-empire'],
  },
  {
    id: 'modern',
    name: { uk: 'Новий час', en: 'Modern' },
    startYear: 1800,
    endYear: 1991,
    step: 5,
    periods: ['russian-empire', 'liberation-struggle', 'interwar', 'wwii', 'soviet'],
    territories: ['russian-empire', 'austria-hungary', 'ussr'],
  },
  {
    id: 'contemporary',
    name: { uk: 'Сучасність', en: 'Contemporary' },
    startYear: 1991,
    endYear: 2025,
    step: 1,
    periods: ['1990s', '2000s', '2010s', '2020s'],
    territories: ['ukraine-modern'],
  },
];

export function getEraById(id: string): EraConfig | undefined {
  return ERAS.find((era) => era.id === id);
}

export function getEraByYear(year: number): EraConfig | undefined {
  return ERAS.find((era) => year >= era.startYear && year < era.endYear);
}

export interface GenerateTicksOptions {
  start: number;
  end: number;
  step: number;
  includeStart?: boolean;
  includeEnd?: boolean;
  includeZero?: boolean;
}

export function generateTicks({ start, end, step, includeStart = false, includeEnd = false, includeZero = true }: GenerateTicksOptions): number[] {
  const ticks: number[] = [];

  const firstTick = Math.ceil(start / step) * step;

  for (let tick = firstTick; tick <= end; tick += step) {
    ticks.push(tick);
  }

  if (includeZero && start < 0 && end > 0 && !ticks.includes(0)) {
    ticks.push(0);
    ticks.sort((a, b) => a - b);
  }

  if (includeStart && ticks[0] !== start) {
    ticks.unshift(start);
  }

  if (includeEnd && ticks[ticks.length - 1] !== end) {
    ticks.push(end);
  }

  return ticks;
}
