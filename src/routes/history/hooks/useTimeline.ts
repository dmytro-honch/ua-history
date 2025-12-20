import { useState, useCallback, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ERAS, type EraConfig, getEraById } from 'data/config/eras';

const DEFAULT_ERA = ERAS[2]; // medieval

interface UseTimelineResult {
  era: EraConfig;
  year: number;
  setEra: (eraId: string) => void;
  setYear: (year: number) => void;
  stepForward: () => void;
  stepBackward: () => void;
  formatYear: (year: number) => string;
}

export function useTimeline(): UseTimelineResult {
  const [searchParams, setSearchParams] = useSearchParams();

  // Локальний стейт замість useMemo
  const [era, setEraState] = useState<EraConfig>(DEFAULT_ERA);
  const [year, setYearState] = useState<number>(DEFAULT_ERA.startYear);

  // Синхронізація з URL (один раз при монтуванні і при зміні URL)
  useEffect(() => {
    const eraId = searchParams.get('era');
    const yearParam = searchParams.get('year');

    const newEra = (eraId && getEraById(eraId)) || DEFAULT_ERA;
    setEraState(newEra);

    if (yearParam) {
      const parsed = parseInt(yearParam, 10);
      const clamped = Math.max(newEra.startYear, Math.min(newEra.endYear, parsed));
      setYearState(clamped);
    } else {
      setYearState(Math.round((newEra.startYear + newEra.endYear) / 2));
    }
  }, [searchParams]);

  const updateURL = useCallback(
    (newEraId: string, newYear: number) => {
      setSearchParams({ era: newEraId, year: String(newYear) }, { replace: true });
    },
    [setSearchParams]
  );

  const setEra = useCallback(
    (newEraId: string) => {
      const newEra = getEraById(newEraId);
      if (newEra) {
        const newYear = Math.round((newEra.startYear + newEra.endYear) / 2);
        updateURL(newEraId, newYear);
      }
    },
    [updateURL]
  );

  const setYear = useCallback(
    (newYear: number) => {
      const clamped = Math.max(era.startYear, Math.min(era.endYear, newYear));
      updateURL(era.id, clamped);
    },
    [era, updateURL]
  );

  const stepForward = useCallback(() => {
    setYear(year + era.step);
  }, [year, era.step, setYear]);

  const stepBackward = useCallback(() => {
    setYear(year - era.step);
  }, [year, era.step, setYear]);

  const formatYear = useCallback((y: number): string => {
    if (y < 0) {
      return `${Math.abs(y)} до н.е.`;
    }
    return String(y);
  }, []);

  return {
    era,
    year,
    setEra,
    setYear,
    stepForward,
    stepBackward,
    formatYear,
  };
}
