import { useState, useCallback, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ERAS, type EraConfig, getEraById } from '@/config/eras';

const DEFAULT_ERA = ERAS[2]; // medieval

export function useTimeline() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [era, setEraState] = useState<EraConfig>(DEFAULT_ERA);
  const [year, setYearState] = useState<number>(DEFAULT_ERA.startYear);

  useEffect(() => {
    const eraId = searchParams.get('era');
    const yearParam = searchParams.get('year');

    const newEra = (eraId && getEraById(eraId)) || DEFAULT_ERA;
    setEraState(newEra);

    if (yearParam) {
      const parsed = parseInt(yearParam, 10);
      const clamped = Math.max(newEra.startYear, Math.min(newEra.endYear, parsed));
      setYearState(clamped);
      return;
    }

    setYearState(newEra.startYear);
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
        const newYear = newEra.startYear;
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

  const formatYear = useCallback((y: number, bc: string, ac: string): string => {
    if (y < 0) {
      return `${Math.abs(y)} ${bc}`;
    }
    return `${y} ${ac}`;
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
