import { useEffect, useState } from 'react';

// Центр для КВАДРАТНОГО екрану (Україна в центрі)
const BASE_CENTER = { lat: 48.5, lng: 31.0 };

// Мінімальний радіус видимості
const CORE_RADIUS = {
  lat: 12,
  lng: 15,
};

// Максимальне зміщення центру на захід (для широких екранів)
const MAX_WEST_OFFSET = 12; // градусів

export interface Bounds {
  minLat: number;
  maxLat: number;
  minLng: number;
  maxLng: number;
}

export function calculateDynamicBounds(containerWidth: number, containerHeight: number): Bounds {
  const containerAspect = containerWidth / containerHeight;
  const lngCorrectionFactor = Math.cos((BASE_CENTER.lat * Math.PI) / 180);

  let latRadius = CORE_RADIUS.lat;
  let lngRadius = CORE_RADIUS.lng;

  const coreAspect = (lngRadius * lngCorrectionFactor) / latRadius;

  // Зміщення центру на захід для широких екранів
  let centerLng = BASE_CENTER.lng;

  if (containerAspect > coreAspect) {
    // Екран ширший — розширюємо по довготі
    const newLngRadius = (latRadius * containerAspect) / lngCorrectionFactor;
    const extraWidth = newLngRadius - lngRadius;

    // Зміщуємо центр на захід (але не більше MAX_WEST_OFFSET)
    const westOffset = Math.min(extraWidth * 0.7, MAX_WEST_OFFSET);
    centerLng = BASE_CENTER.lng - westOffset;

    lngRadius = newLngRadius;
  } else {
    // Екран вищий — розширюємо по широті
    latRadius = (lngRadius * lngCorrectionFactor) / containerAspect;
  }

  return {
    minLat: BASE_CENTER.lat - latRadius,
    maxLat: BASE_CENTER.lat + latRadius,
    minLng: centerLng - lngRadius,
    maxLng: centerLng + lngRadius,
  };
}

// Гянджа, Азербайджан — наша східна межа
const HARD_LIMITS = {
  east: 47, // Гянджа ≈ 46.4°, трохи запасу
  south: 40, // Південна Туреччина/Кіпр
};

// Україна
const UKRAINE_CENTER = { lat: 48.5, lng: 31.0 };

// Мінімальна видима область (ядро)
const CORE = {
  west: 14, // Німеччина/Польща
  north: 60, // Фінляндія/Естонія
};

export interface Bounds {
  minLat: number;
  maxLat: number;
  minLng: number;
  maxLng: number;
}

export function calculateDynamicBounds2(containerWidth: number, containerHeight: number): Bounds {
  const containerAspect = containerWidth / containerHeight;

  // Фіксовані межі
  const maxLng = HARD_LIMITS.east;
  const minLat = HARD_LIMITS.south;

  // Ядро (мінімум)
  let minLng = CORE.west;
  let maxLat = CORE.north;

  // Aspect ratio ядра
  const lngRange = maxLng - minLng; // 47 - 14 = 33°
  const latRange = maxLat - minLat; // 60 - 34 = 26°
  const lngCorrectionFactor = Math.cos((UKRAINE_CENTER.lat * Math.PI) / 180); // ≈ 0.66
  const coreAspect = (lngRange * lngCorrectionFactor) / latRange;

  if (containerAspect > coreAspect) {
    // Екран ширший — розширюємо на ЗАХІД
    const targetLngRange = (latRange * containerAspect) / lngCorrectionFactor;
    const extraLng = targetLngRange - lngRange;
    minLng = minLng - extraLng; // Йдемо на захід (Франція, Іспанія, UK...)
  } else {
    // Екран вищий — розширюємо на ПІВНІЧ
    const targetLatRange = (lngRange * lngCorrectionFactor) / containerAspect;
    const extraLat = targetLatRange - latRange;
    maxLat = maxLat + extraLat; // Йдемо на північ (Норвегія, Ісландія...)
  }

  return { minLat, maxLat, minLng, maxLng };
}

function getAvailableHeight(): number {
  const header = document.querySelector('#app-header');
  const footer = document.querySelector('#app-footer');
  const headerHeight = (header?.clientHeight || 0) + 1;
  const footerHeight = (footer?.clientHeight || 0) + 1;
  return window.innerHeight - headerHeight - footerHeight;
}

export function useMapSize(): {
  width: number;
  height: number;
  bounds: Bounds;
} {
  const [state, setState] = useState({
    width: 100,
    height: 100,
    bounds: calculateDynamicBounds2(100, 100),
  });

  useEffect(() => {
    const calculate = () => {
      const width = window.innerWidth;
      const height = getAvailableHeight();

      // Перевірка, що height коректний (header вже є)
      if (height > 0 && height < window.innerHeight) {
        setState({
          width,
          height,
          bounds: calculateDynamicBounds2(width, height),
        });
      }
    };

    // Перший розрахунок з невеликою затримкою (DOM має встигнути)
    const timeoutId = setTimeout(calculate, 0);

    // Також слухаємо resize
    window.addEventListener('resize', calculate);

    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('resize', calculate);
    };
  }, []);

  return state;
}
