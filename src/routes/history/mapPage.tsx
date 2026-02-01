import { GeoMap, type GeoJSONFeature, type MapLayer } from '@/lib/mapRenderer';
import { useMapSize } from '../../hooks/useMapSize';
import { useTimeline } from '../../hooks/useTimeline';
import { useMemo } from 'react';
import { TimelineControls } from '@/components/timelineControls';
import { useI18n } from '@/providers';
import { useTerritories } from '@/hooks/useTerritoriesData';

export function MapPage() {
  const { text } = useI18n();
  const { bc: bcPostfix, ac: acPostfix } = text.dates;

  const { width, height, bounds } = useMapSize();

  const { ukraine, europe, isLoading, isError, error } = useTerritories();

  const timeline = useTimeline();
  const { year } = timeline;

  console.log({ isLoading, isError, ukraine, europe });

  const layers: MapLayer[] = useMemo(() => {
    if (!europe || !ukraine) return [];

    return [
      {
        id: 'countries',
        data: europe,
        filter: (f: GeoJSONFeature) => f.properties?.NAME !== 'Ukraine',
        style: { fillColor: '#4a5568', strokeColor: '#2d3748', strokeWidth: 0.5 },
        zIndex: 0,
      },
      {
        id: 'ukraine',
        data: ukraine,
        style: { fillColor: '#627088ff', strokeColor: '#2d3748', strokeWidth: 1 },
        zIndex: 10,
      },
      // TODO: додати territories layer на основі year
    ];
  }, [europe, year, ukraine]);

  const markers = [
    { id: 'kyiv', lat: 50.4501, lng: 30.5234, style: { fillColor: '#e74c3c' } },
    { id: 'lviv', lat: 49.8397, lng: 24.0297, style: { fillColor: '#e74c3c' } },
  ];

  if (isLoading) {
    return (
      <div className="map__spinner--wapper">
        <span className="map__spinner"></span>
      </div>
    );
  }

  if (isError && error) {
    return <div className="map__spinner--wapper">{JSON.stringify(error)}</div>;
  }

  return (
    <div className="map__wrapper">
      <div className="map__controls">
        <div className="map__controls--toolbar">
          <svg width={400} height={500} viewBox="0 0 200 500">
            <rect x="0" y="0" width="200" height="500" fill="none" />
          </svg>
        </div>
        <div className="map__controls--timeline">
          <TimelineControls timeline={timeline} bcPostfix={bcPostfix} acPostfix={acPostfix} />
        </div>
      </div>
      <GeoMap
        className="map"
        width={width}
        height={height}
        bounds={bounds}
        layers={layers}
        markers={markers}
        onMarkerClick={(marker) => console.log('Clicked:', marker)}
      />
    </div>
  );
}
