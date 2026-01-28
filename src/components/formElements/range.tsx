import { generateTicks } from '@/config/eras';
import { useRef, useState, useEffect, useCallback, useMemo } from 'react';

type HighlightRange = {
  from: number;
  to: number;
  color?: string;
};

type RangeProps = {
  start: number;
  end: number;
  step: number;
  year: number;
  onChange: (year: number) => void;
  formatYear?: (year: number) => string;
  highlight?: HighlightRange | null;
  width: number;
};

export function Range({ start, end, step, year, onChange, formatYear = (y) => String(y), highlight = null, width }: RangeProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const PADDING = 30;
  const trackWidth = width - PADDING * 2;

  const yearToX = useCallback(
    (y: number): number => {
      const ratio = (y - start) / (end - start);
      return PADDING + ratio * trackWidth;
    },
    [start, end, trackWidth]
  );

  const xToYear = useCallback(
    (x: number): number => {
      const ratio = (x - PADDING) / trackWidth;
      const rawYear = start + ratio * (end - start);
      const snapped = Math.round(rawYear / step) * step;
      return Math.max(start, Math.min(end, snapped));
    },
    [start, end, step, trackWidth]
  );

  const handleClick = useCallback(
    (e: React.MouseEvent<SVGSVGElement>) => {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const newYear = xToYear(x);
      onChange(newYear);
    },
    [xToYear, onChange]
  );

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = wrapperRef.current?.getBoundingClientRect();
      if (!rect) return;
      const x = e.clientX - rect.left;
      const newYear = xToYear(x);
      onChange(newYear);
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, xToYear, onChange]);

  const thumbX = yearToX(year);

  const highlightX1 = highlight ? yearToX(highlight.from) : 0;
  const highlightX2 = highlight ? yearToX(highlight.to) : 0;

  const ticks = generateTicks({ start, end, step, includeStart: true, includeEnd: true, includeZero: true });
  const labelStep = useMemo(() => {
    return calculateLabelStep(trackWidth, ticks.length);
  }, [trackWidth, ticks.length]);
  const normalizedTicks = useMemo(() => {
    const result = ticks.reduce<{
      items: Array<{ tick: number; showLabel: boolean; x: number; isOnTop: boolean }>;
      visibleCount: number;
    }>(
      (acc, tick, i, all) => {
        const showLabel = shouldShowLabel(tick, i, labelStep, all);
        const isOnTop = showLabel ? acc.visibleCount % 2 === 0 : false;

        acc.items.push({
          tick,
          showLabel,
          x: yearToX(tick),
          isOnTop,
        });

        if (showLabel) {
          acc.visibleCount++;
        }

        return acc;
      },
      { items: [], visibleCount: 0 }
    );

    return result.items;
  }, [ticks, labelStep, yearToX]);

  if (width === 0) {
    return <div className="range__wrapper" ref={wrapperRef} style={{ height: 60 }} />;
  }

  return (
    <div className="range__wrapper" ref={wrapperRef}>
      <svg width={width} height="60" viewBox={`0 0 ${width} 60`} style={{ cursor: 'pointer', userSelect: 'none', fill: 'currentColor' }} onClick={handleClick}>
        <line x1={PADDING} y1={30} x2={width - PADDING} y2={30} stroke="var(--color-track, #4a5568)" strokeWidth={6} strokeLinecap="round" />

        <line x1={PADDING} y1={30} x2={thumbX} y2={30} stroke="var(--color-active, #3182ce)" strokeWidth={6} strokeLinecap="round" />

        {highlight && (
          <line x1={highlightX1} y1={30} x2={highlightX2} y2={30} stroke={highlight.color || '#e95420'} strokeWidth={6} strokeLinecap="round" opacity={0.8} />
        )}

        {normalizedTicks.map(({ tick, showLabel, x, isOnTop }) => {
          const y = isOnTop ? 12 : 55;

          return (
            <g key={tick}>
              <line x1={x} y1={20} x2={x} y2={40} stroke="currentColor" strokeWidth={1} />
              {showLabel && (
                <text x={x} y={y} textAnchor="middle" fontSize={10} fill="currentColor">
                  {formatYear(tick)}
                </text>
              )}
            </g>
          );
        })}

        <circle
          cx={thumbX}
          cy={30}
          r={10}
          fill="var(--color-thumb, #fff)"
          stroke="var(--color-thumb-border, #3182ce)"
          strokeWidth={3}
          style={{ cursor: 'grab' }}
          onMouseDown={handleMouseDown}
        />
      </svg>
    </div>
  );
}

const MIN_LABEL_SPACING = 60;

export function calculateLabelStep(trackWidth: number, totalTicks: number): number {
  if (totalTicks <= 1) return 1;

  const spacingPerTick = trackWidth / (totalTicks - 1);

  const labelStep = Math.ceil(MIN_LABEL_SPACING / spacingPerTick);

  return labelStep;
}

function shouldShowLabel(tick: number, index: number, labelStep: number, ticks: number[]): boolean {
  if (index === 0 || index === ticks.length - 1) return true;

  if (tick === 0) return true;

  if (tick % 1000 === 0) return true;
  if (tick % 100 === 0 && labelStep <= 3) return true;

  return index % labelStep === 0;
}
