import { useRef, useEffect, useCallback, useState } from 'react';

export interface Bounds {
  minLat: number;
  maxLat: number;
  minLng: number;
  maxLng: number;
}

export interface Point {
  x: number;
  y: number;
}

export interface RenderStyle {
  fillColor?: string;
  strokeColor?: string;
  strokeWidth?: number;
  opacity?: number;
  blur?: number;
}

export interface RenderOptions {
  /** Default style for all features */
  defaultStyle?: RenderStyle;
  /** Style override per feature (by property key) */
  featureStyle?: (feature: GeoJSONFeature) => RenderStyle | undefined;
  /** Filter features to render */
  filter?: (feature: GeoJSONFeature) => boolean;
}

// GeoJSON Types (simplified)
export interface GeoJSONFeature {
  type: 'Feature';
  properties: Record<string, unknown> | null;
  geometry: GeoJSONGeometry;
}

export interface GeoJSONFeatureCollection {
  type: 'FeatureCollection';
  features: GeoJSONFeature[];
}

export type GeoJSONGeometry =
  | { type: 'Point'; coordinates: number[] }
  | { type: 'MultiPoint'; coordinates: number[][] }
  | { type: 'LineString'; coordinates: number[][] }
  | { type: 'MultiLineString'; coordinates: number[][][] }
  | { type: 'Polygon'; coordinates: number[][][] }
  | { type: 'MultiPolygon'; coordinates: number[][][][] };

// =============================================================================
// GeoRenderer Class
// =============================================================================

export class GeoRenderer {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private bounds: Bounds;
  private pixelRatio: number;

  // Actual drawing dimensions (accounting for pixel ratio)
  private drawWidth: number;
  private drawHeight: number;

  constructor(canvas: HTMLCanvasElement, bounds: Bounds) {
    this.canvas = canvas;
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      throw new Error('Could not get 2D context from canvas');
    }
    this.ctx = ctx;
    this.bounds = bounds;
    this.pixelRatio = window.devicePixelRatio || 1;

    // Store logical dimensions
    this.drawWidth = canvas.width;
    this.drawHeight = canvas.height;

    this.setupRetina();
  }

  /**
   * Setup canvas for Retina/HiDPI displays
   */
  private setupRetina(): void {
    const { canvas, pixelRatio } = this;
    const logicalWidth = canvas.width;
    const logicalHeight = canvas.height;

    // Scale canvas for retina
    canvas.width = logicalWidth * pixelRatio;
    canvas.height = logicalHeight * pixelRatio;

    // Scale back down via CSS
    canvas.style.width = `${logicalWidth}px`;
    canvas.style.height = `${logicalHeight}px`;

    // Scale context so we can draw in logical pixels
    this.ctx.scale(pixelRatio, pixelRatio);

    this.drawWidth = logicalWidth;
    this.drawHeight = logicalHeight;
  }

  /**
   * Update bounds (e.g., for pan/zoom, though not needed for fixed map)
   */
  setBounds(bounds: Bounds): void {
    this.bounds = bounds;
  }

  /**
   * Get current bounds
   */
  getBounds(): Bounds {
    return { ...this.bounds };
  }

  /**
   * Project geographic coordinates to canvas pixels
   * Uses simple equirectangular projection (good enough for regional maps)
   */
  project(lat: number, lng: number): Point {
    const { bounds, drawWidth, drawHeight } = this;

    const x = ((lng - bounds.minLng) / (bounds.maxLng - bounds.minLng)) * drawWidth;
    const y = ((bounds.maxLat - lat) / (bounds.maxLat - bounds.minLat)) * drawHeight;

    return { x, y };
  }

  /**
   * Unproject canvas pixels to geographic coordinates
   * Useful for hit testing
   */
  unproject(x: number, y: number): { lat: number; lng: number } {
    const { bounds, drawWidth, drawHeight } = this;

    const lng = (x / drawWidth) * (bounds.maxLng - bounds.minLng) + bounds.minLng;
    const lat = bounds.maxLat - (y / drawHeight) * (bounds.maxLat - bounds.minLat);

    return { lat, lng };
  }

  /**
   * Clear the canvas
   */
  clear(backgroundColor?: string): void {
    const { ctx, drawWidth, drawHeight } = this;

    ctx.clearRect(0, 0, drawWidth, drawHeight);

    if (backgroundColor) {
      ctx.fillStyle = backgroundColor;
      ctx.fillRect(0, 0, drawWidth, drawHeight);
    }
  }

  /**
   * Render a GeoJSON FeatureCollection
   */
  render(geojson: GeoJSONFeatureCollection, options: RenderOptions = {}): void {
    const { defaultStyle = {}, featureStyle, filter } = options;

    const features = filter ? geojson.features.filter(filter) : geojson.features;

    for (const feature of features) {
      const style = {
        ...defaultStyle,
        ...featureStyle?.(feature),
      };
      this.renderFeature(feature, style);
    }
  }

  /**
   * Render a single GeoJSON Feature
   */
  renderFeature(feature: GeoJSONFeature, style: RenderStyle = {}): void {
    const { geometry } = feature;

    switch (geometry.type) {
      case 'Polygon':
        this.renderPolygon(geometry.coordinates, style);
        break;
      case 'MultiPolygon':
        for (const polygon of geometry.coordinates) {
          this.renderPolygon(polygon, style);
        }
        break;
      case 'LineString':
        this.renderLineString(geometry.coordinates, style);
        break;
      case 'MultiLineString':
        for (const line of geometry.coordinates) {
          this.renderLineString(line, style);
        }
        break;
      case 'Point':
        this.renderPoint(geometry.coordinates, style);
        break;
      case 'MultiPoint':
        for (const point of geometry.coordinates) {
          this.renderPoint(point, style);
        }
        break;
    }
  }

  /**
   * Render a polygon (with optional holes)
   */
  private renderPolygon(coordinates: number[][][], style: RenderStyle): void {
    const { ctx } = this;
    const { fillColor = '#cccccc', strokeColor = '#999999', strokeWidth = 1, opacity = 1, blur = 0 } = style;

    ctx.save();

    // Apply blur if specified
    if (blur > 0) {
      ctx.filter = `blur(${blur}px)`;
    }

    ctx.globalAlpha = opacity;
    ctx.beginPath();

    // First ring is the outer boundary
    const outerRing = coordinates[0];
    this.tracePath(outerRing);

    // Subsequent rings are holes (drawn in reverse to create holes via even-odd rule)
    for (let i = 1; i < coordinates.length; i++) {
      this.tracePath(coordinates[i]);
    }

    // Fill
    if (fillColor && fillColor !== 'none') {
      ctx.fillStyle = fillColor;
      ctx.fill('evenodd');
    }

    // Stroke
    if (strokeColor && strokeColor !== 'none' && strokeWidth > 0) {
      ctx.strokeStyle = strokeColor;
      ctx.lineWidth = strokeWidth;
      ctx.stroke();
    }

    ctx.restore();
  }

  /**
   * Render a line string
   */
  private renderLineString(coordinates: number[][], style: RenderStyle): void {
    const { ctx } = this;
    const { strokeColor = '#999999', strokeWidth = 1, opacity = 1 } = style;

    if (!strokeColor || strokeColor === 'none' || strokeWidth <= 0) {
      return;
    }

    ctx.save();
    ctx.globalAlpha = opacity;
    ctx.strokeStyle = strokeColor;
    ctx.lineWidth = strokeWidth;

    ctx.beginPath();
    this.tracePath(coordinates, false);
    ctx.stroke();

    ctx.restore();
  }

  /**
   * Render a point
   */
  private renderPoint(coordinates: number[], style: RenderStyle): void {
    const { ctx } = this;
    const { fillColor = '#ff0000', strokeColor = '#990000', strokeWidth = 1, opacity = 1 } = style;

    const [lng, lat] = coordinates;
    const { x, y } = this.project(lat, lng);
    const radius = 5;

    ctx.save();
    ctx.globalAlpha = opacity;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);

    if (fillColor && fillColor !== 'none') {
      ctx.fillStyle = fillColor;
      ctx.fill();
    }

    if (strokeColor && strokeColor !== 'none' && strokeWidth > 0) {
      ctx.strokeStyle = strokeColor;
      ctx.lineWidth = strokeWidth;
      ctx.stroke();
    }

    ctx.restore();
  }

  /**
   * Trace a path from coordinate array
   */
  private tracePath(coordinates: number[][], close: boolean = true): void {
    const { ctx } = this;

    for (let i = 0; i < coordinates.length; i++) {
      const [lng, lat] = coordinates[i];
      const { x, y } = this.project(lat, lng);

      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    }

    if (close) {
      ctx.closePath();
    }
  }

  /**
   * Draw a circle at geographic coordinates
   */
  drawCircle(lat: number, lng: number, radius: number, style: RenderStyle = {}): void {
    const { ctx } = this;
    const { x, y } = this.project(lat, lng);
    const { fillColor = '#ff0000', strokeColor = '#990000', strokeWidth = 1, opacity = 1 } = style;

    ctx.save();
    ctx.globalAlpha = opacity;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);

    if (fillColor && fillColor !== 'none') {
      ctx.fillStyle = fillColor;
      ctx.fill();
    }

    if (strokeColor && strokeColor !== 'none' && strokeWidth > 0) {
      ctx.strokeStyle = strokeColor;
      ctx.lineWidth = strokeWidth;
      ctx.stroke();
    }

    ctx.restore();
  }

  /**
   * Draw text at geographic coordinates
   */
  drawText(
    lat: number,
    lng: number,
    text: string,
    options: {
      font?: string;
      color?: string;
      align?: CanvasTextAlign;
      baseline?: CanvasTextBaseline;
      offsetX?: number;
      offsetY?: number;
    } = {}
  ): void {
    const { ctx } = this;
    const { x, y } = this.project(lat, lng);
    const { font = '12px sans-serif', color = '#333333', align = 'center', baseline = 'middle', offsetX = 0, offsetY = 0 } = options;

    ctx.save();
    ctx.font = font;
    ctx.fillStyle = color;
    ctx.textAlign = align;
    ctx.textBaseline = baseline;
    ctx.fillText(text, x + offsetX, y + offsetY);
    ctx.restore();
  }

  /**
   * Get canvas context for custom drawing
   */
  getContext(): CanvasRenderingContext2D {
    return this.ctx;
  }

  /**
   * Get canvas element
   */
  getCanvas(): HTMLCanvasElement {
    return this.canvas;
  }

  /**
   * Get drawing dimensions (logical, not physical)
   */
  getDimensions(): { width: number; height: number } {
    return { width: this.drawWidth, height: this.drawHeight };
  }
}

// =============================================================================
// Utility Functions
// =============================================================================
type TripleCoords = number[] | number[][] | number[][][];
type Coordinates = TripleCoords | number[][][][];
/**
 * Calculate bounds from GeoJSON
 */
export function calculateBounds(geojson: GeoJSONFeatureCollection): Bounds {
  let minLat = Infinity;
  let maxLat = -Infinity;
  let minLng = Infinity;
  let maxLng = -Infinity;

  function processCoordinates(coords: Coordinates): void {
    if (typeof coords[0] === 'number') {
      const [lng, lat] = coords as number[];
      minLat = Math.min(minLat, lat);
      maxLat = Math.max(maxLat, lat);
      minLng = Math.min(minLng, lng);
      maxLng = Math.max(maxLng, lng);
    } else {
      for (const item of coords) {
        processCoordinates(item as TripleCoords);
      }
    }
  }

  for (const feature of geojson.features) {
    processCoordinates(feature.geometry.coordinates);
  }

  return { minLat, maxLat, minLng, maxLng };
}

/**
 * Add padding to bounds
 */
export function padBounds(bounds: Bounds, padding: number): Bounds {
  const latRange = bounds.maxLat - bounds.minLat;
  const lngRange = bounds.maxLng - bounds.minLng;

  return {
    minLat: bounds.minLat - latRange * padding,
    maxLat: bounds.maxLat + latRange * padding,
    minLng: bounds.minLng - lngRange * padding,
    maxLng: bounds.maxLng + lngRange * padding,
  };
}

/**
 * Predefined bounds for Europe (including Turkey)
 */
export const EUROPE_BOUNDS: Bounds = {
  minLat: 34, // Southern tip (Cyprus, Crete)
  maxLat: 72, // Northern Scandinavia
  minLng: -12, // Western Portugal/Ireland
  maxLng: 45, // Eastern Turkey/Russia border
};

/**
 * Bounds focused on Ukraine and surrounding region
 */
export const UKRAINE_REGION_BOUNDS: Bounds = {
  minLat: 42, // Black Sea / Turkey
  maxLat: 58, // Belarus / Baltic
  minLng: 18, // Poland
  maxLng: 42, // Russia
};

// =============================================================================
// Fetch Helper
// =============================================================================

/**
 * Load GeoJSON from URL
 */
export async function loadGeoJSON(url: string): Promise<GeoJSONFeatureCollection> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to load GeoJSON: ${response.status}`);
  }
  return response.json();
}

// =============================================================================
// Types
// =============================================================================

export interface MapLayer {
  id: string;
  data: GeoJSONFeatureCollection;
  style?: RenderStyle;
  featureStyle?: (feature: GeoJSONFeature) => RenderStyle | undefined;
  filter?: (feature: GeoJSONFeature) => boolean;
  zIndex?: number;
}

export interface MapMarker {
  id: string;
  lat: number;
  lng: number;
  radius?: number;
  style?: RenderStyle;
  label?: string;
}

export interface GeoMapProps {
  /** Canvas width in pixels */
  width?: number;
  /** Canvas height in pixels */
  height?: number;
  /** Map bounds */
  bounds?: Bounds;
  /** Background color (sea) */
  backgroundColor?: string;
  /** Layers to render (rendered in order of zIndex) */
  layers?: MapLayer[];
  /** Markers to render on top */
  markers?: MapMarker[];
  /** Callback when a marker is clicked */
  onMarkerClick?: (marker: MapMarker) => void;
  /** Callback when map background is clicked */
  onMapClick?: (lat: number, lng: number) => void;
  /** CSS class for the canvas */
  className?: string;
}

// =============================================================================
// Hook: useGeoRenderer
// =============================================================================

export function useGeoRenderer(canvasRef: React.RefObject<HTMLCanvasElement>, bounds: Bounds = EUROPE_BOUNDS) {
  const rendererRef = useRef<GeoRenderer | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    rendererRef.current = new GeoRenderer(canvasRef.current, bounds);

    return () => {
      rendererRef.current = null;
    };
  }, [canvasRef, bounds]);

  const updateBounds = useCallback((newBounds: Bounds) => {
    rendererRef.current?.setBounds(newBounds);
  }, []);

  return {
    renderer: rendererRef.current,
    updateBounds,
  };
}

// =============================================================================
// Hook: useGeoJSON
// =============================================================================

export function useGeoJSON(url: string) {
  const [data, setData] = useState<GeoJSONFeatureCollection | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!url) {
      setData(null);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setError(null);

    loadGeoJSON(url)
      .then((geojson) => {
        if (!cancelled) {
          setData(geojson);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err);
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [url]);

  return { data, loading, error };
}

// =============================================================================
// Component: GeoMap
// =============================================================================

export function GeoMap({
  width = 800,
  height = 600,
  bounds = EUROPE_BOUNDS,
  backgroundColor = '#007cff75',
  layers = [],
  markers = [],
  onMarkerClick,
  onMapClick,
  className,
}: GeoMapProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rendererRef = useRef<GeoRenderer | null>(null);

  // Initialize renderer
  useEffect(() => {
    if (!canvasRef.current) return;

    // Store dimensions before GeoRenderer modifies them for retina
    const canvas = canvasRef.current;
    canvas.width = width;
    canvas.height = height;

    rendererRef.current = new GeoRenderer(canvas, bounds);
  }, [width, height]); // Only recreate on size change

  // Update bounds when they change
  useEffect(() => {
    rendererRef.current?.setBounds(bounds);
  }, [bounds]);

  // Render layers and markers
  useEffect(() => {
    const renderer = rendererRef.current;
    if (!renderer) return;

    // Clear canvas
    renderer.clear(backgroundColor);

    // Sort layers by zIndex
    const sortedLayers = [...layers].sort((a, b) => (a.zIndex ?? 0) - (b.zIndex ?? 0));

    // Render each layer
    for (const layer of sortedLayers) {
      renderer.render(layer.data, {
        defaultStyle: layer.style,
        featureStyle: layer.featureStyle,
        filter: layer.filter,
      });
    }

    // Render markers on top
    for (const marker of markers) {
      renderer.drawCircle(marker.lat, marker.lng, marker.radius ?? 6, marker.style);
    }
  }, [layers, markers, backgroundColor, bounds]);

  // Handle clicks
  const handleClick = useCallback(
    (event: React.MouseEvent<HTMLCanvasElement>) => {
      const renderer = rendererRef.current;
      if (!renderer) return;

      const canvas = canvasRef.current;
      if (!canvas) return;

      const rect = canvas.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;

      // Check if any marker was clicked
      if (onMarkerClick) {
        for (const marker of markers) {
          const point = renderer.project(marker.lat, marker.lng);
          const radius = marker.radius ?? 6;
          const distance = Math.sqrt((x - point.x) ** 2 + (y - point.y) ** 2);

          if (distance <= radius + 5) {
            // 5px tolerance
            onMarkerClick(marker);
            return;
          }
        }
      }

      // Map background click
      if (onMapClick) {
        const { lat, lng } = renderer.unproject(x, y);
        onMapClick(lat, lng);
        console.log(`lat: ${lat}, lng: ${lng}`);
      }
    },
    [markers, onMarkerClick, onMapClick]
  );

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      onClick={handleClick}
      className={className}
      style={{ cursor: onMarkerClick || onMapClick ? 'pointer' : 'default' }}
    />
  );
}
