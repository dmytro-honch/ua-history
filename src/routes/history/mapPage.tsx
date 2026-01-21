import { GeoMap, useGeoJSON, type GeoJSONFeature, type MapLayer } from '@/lib/mapRenderer';
import { useMapSize } from '../../hooks/useMapSize';
import { useTimeline } from '../../hooks/useTimeline';
import { useMemo } from 'react';
import { TimelineControls } from '@/components/timelineControls';
import { useI18n } from '@/providers';

const isDev = import.meta.env.DEV;

// TODO: optimize jsons
export const DATA_BASE_URL = isDev ? '/data/territories/europe.geojson' : 'https://raw.githubusercontent.com/your-username/ukraine-history/main/data';
export const UKRAINE_DATA_BASE_URL = isDev ? '/data/territories/ukraine.geojson' : 'https://raw.githubusercontent.com/your-username/ukraine-history/main/data';
// export const DATA_BASE_URL_SIMPLIFYED = isDev
//   ? '/data/territories/europe-simplified.geojson'
//   : 'https://raw.githubusercontent.com/your-username/ukraine-history/main/data';

export function MapPage() {
  const { text } = useI18n();
  const { bc: bcPostfix, ac: acPostfix } = text.dates;

  const { width, height, bounds } = useMapSize();
  const { data: europeData, loading } = useGeoJSON(DATA_BASE_URL);
  const { data: ukraineData, loading: ukraineloading } = useGeoJSON(UKRAINE_DATA_BASE_URL);

  const timeline = useTimeline();
  const { year } = timeline;

  const layers: MapLayer[] = useMemo(() => {
    if (!europeData || !ukraineData) return [];

    return [
      {
        id: 'countries',
        data: europeData,
        filter: (f: GeoJSONFeature) => f.properties?.NAME !== 'Ukraine',
        style: { fillColor: '#4a5568', strokeColor: '#2d3748', strokeWidth: 0.5 },
        zIndex: 0,
      },
      {
        id: 'ukraine',
        data: ukraineData,
        style: { fillColor: '#627088ff', strokeColor: '#2d3748', strokeWidth: 2 },
        zIndex: 10,
      },
      // TODO: додати territories layer на основі year
    ];
  }, [europeData, year, ukraineData]);

  const markers = [
    { id: 'kyiv', lat: 50.4501, lng: 30.5234, style: { fillColor: '#e74c3c' } },
    { id: 'lviv', lat: 49.8397, lng: 24.0297, style: { fillColor: '#e74c3c' } },
  ];

  if (loading || !europeData || ukraineloading || !ukraineData) {
    return (
      <div className="map__spinner--wapper">
        <span className="map__spinner"></span>
      </div>
    );
  }

  return (
    <div className="map__wrapper">
      <GeoMap
        className="map"
        width={width}
        height={height}
        bounds={bounds}
        layers={layers}
        markers={markers}
        onMarkerClick={(marker) => console.log('Clicked:', marker.id)}
      />
      <div className="map-page__controls">
        <TimelineControls timeline={timeline} bcPostfix={bcPostfix} acPostfix={acPostfix} />
      </div>
    </div>
  );
}
