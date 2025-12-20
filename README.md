# Ukraine History — Interactive Library

An open-source, crowdsourced interactive library of Ukrainian history featuring a timeline-synchronized map visualization.

## Project Vision

This project aims to create an accessible, educational resource for exploring Ukrainian history through an interactive map of Europe with a synchronized timeline. Users can navigate through historical eras, see how borders changed over time, and explore events that shaped Ukraine's history.

## Features

- **Interactive Map**: Canvas-based map of Europe (including Turkey) with modern Ukraine's border always visible
- **Historical Territories**: Semi-transparent "cloud-like" overlays showing historical states and empires with blurred edges
- **Timeline Navigation**: Era selector (macro-navigation) with a slider for fine-grained navigation within each era
- **Event Clustering**: Events grouped by Ukrainian oblasts (regions) or individual cities outside Ukraine
- **Multi-point Comparison**: Up to 2-3 simultaneously active location points with color-coded sidebars
- **Shareable URLs**: Current timeline position and active points encoded in URL for easy sharing
- **Multilingual Support**: Ukrainian and English, with i18n architecture ready for more languages
- **Volunteer Contributions**: Built-in form for volunteers to submit new historical events

## Architecture Decisions

### Rendering

- **Canvas 2D** for map rendering (performance with large datasets)
- Fixed viewport covering Europe without zoom on desktop
- Scroll-based navigation on mobile devices
- Historical territories and long-duration events rendered as blurred polygon overlays

### Data Architecture

- Events grouped by predefined locations (oblasts/cities), not dynamic clustering
- Events can belong to multiple eras
- Locations dictionary with coordinates for validation and rendering
- Separate GeoJSON files for historical territory polygons

### Technology Stack

- React with TypeScript
- Canvas 2D for map rendering
- Monorepo structure (shared types, web app, contributor form)
- GitHub Pages for hosting
- GitHub Actions for PR validation and deployment

## Repository Structure

```
ukraine-history/
├── packages/
│   ├── shared/
│   │   ├── types/
│   │   ├── schemas/
│   │   ├── validators/
│   │   └── utils/
│   src/
│   ├── assets/
│   ├── canvas/
│   ├── components/
│   ├── public/
│   └── routes/
│       ├── history/
│       └── contribute/
├── data/
│   ├── i18n/
│   │   ├── uk.json
│   │   └── en.json
│   ├── locations.json
│   ├── territories/
│   │   ├── kyivan-rus.geojson
│   │   ├── hetmanate.geojson
│   │   └── ...
│   └── events/
│       ├── prehistoric/
│       ├── ancient/
│       ├── medieval/
│       ├── early-modern/
│       ├── modern/
│       └── contemporary/
└── .github/
    └── workflows/
        ├── validate-pr.yml
        └── deploy.yml
```

**packages/shared/** — Shared TypeScript types, JSON schemas, validators, and utilities used by both web app and contribution form.

**packages/web/** — Main React application with map rendering (canvas/), UI components, and routes for history view and contribution form.

**data/i18n/** — UI translation files for each supported language.

**data/locations.json** — Dictionary of all valid locations with coordinates and multilingual names.

**data/territories/** — GeoJSON files defining historical state borders for map overlays.

**data/events/** — Historical events organized by era, with JSON files for each period.

**.github/workflows/** — CI/CD pipelines for PR validation and GitHub Pages deployment.

## Historical Eras and Periods

### Prehistoric (until ~750 BCE)

Before written records about the territory of modern Ukraine.

| Period              | File                   | Approximate Dates |
| ------------------- | ---------------------- | ----------------- |
| Trypillian Culture  | `trypillian.json`      | 5500–2750 BCE     |
| Bronze Age Cultures | `bronze-age.json`      | 3000–1000 BCE     |
| Early Scythians     | `early-scythians.json` | 1000–750 BCE      |

### Ancient (~750 BCE – 375 CE)

Classical antiquity period with written sources.

| Period           | File                  | Approximate Dates |
| ---------------- | --------------------- | ----------------- |
| Scythian Kingdom | `scythians.json`      | 750–250 BCE       |
| Sarmatians       | `sarmatians.json`     | 350 BCE – 375 CE  |
| Greek Colonies   | `greek-colonies.json` | 750–250 BCE       |
| Roman Influence  | `roman-era.json`      | 100 BCE – 375 CE  |

### Medieval (~375 – ~1500)

| Period                 | File                    | Approximate Dates |
| ---------------------- | ----------------------- | ----------------- |
| Great Migration Period | `migration-period.json` | 375–600           |
| Early Slavs            | `early-slavs.json`      | 500–882           |
| Kyivan Rus             | `kyivan-rus.json`       | 882–1240          |
| Galicia-Volhynia       | `galicia-volhynia.json` | 1199–1349         |
| Mongol Period          | `mongol-period.json`    | 1240–1362         |
| Lithuanian Rule        | `lithuanian-rule.json`  | 1362–1569         |

### Early Modern (~1500 – ~1800)

| Period                         | File                     | Approximate Dates |
| ------------------------------ | ------------------------ | ----------------- |
| Polish-Lithuanian Commonwealth | `polish-lithuanian.json` | 1569–1648         |
| Khmelnytsky Uprising           | `khmelnytsky.json`       | 1648–1657         |
| Hetmanate                      | `hetmanate.json`         | 1649–1764         |
| Zaporizhian Sich               | `zaporizhian-sich.json`  | 1552–1775         |
| Ruin Period                    | `ruin.json`              | 1657–1687         |
| Russian Expansion              | `russian-expansion.json` | 1654–1795         |

### Modern (~1800 – 1991)

| Period              | File                       | Approximate Dates |
| ------------------- | -------------------------- | ----------------- |
| Russian Empire Era  | `russian-empire.json`      | 1795–1917         |
| Austrian Galicia    | `austrian-galicia.json`    | 1772–1918         |
| National Revival    | `national-revival.json`    | 1840–1917         |
| World War I         | `wwi.json`                 | 1914–1918         |
| Liberation Struggle | `liberation-struggle.json` | 1917–1921         |
| Interwar Period     | `interwar.json`            | 1921–1939         |
| Holodomor           | `holodomor.json`           | 1932–1933         |
| World War II        | `wwii.json`                | 1939–1945         |
| Soviet Postwar      | `soviet-postwar.json`      | 1945–1991         |

### Contemporary (1991 – present)

| Period                      | File         | Approximate Dates |
| --------------------------- | ------------ | ----------------- |
| Independence & Early Years  | `1990s.json` | 1991–1999         |
| Kuchma Era                  | `2000s.json` | 2000–2009         |
| Yanukovych Era & Euromaidan | `2010s.json` | 2010–2019         |
| Full-Scale War Era          | `2020s.json` | 2020–present      |

## Data Schemas

### Event Structure

```json
{
  "id": "event-uuid",
  "slug": "battle-of-konotop-1659",
  "title": {
    "uk": "Конотопська битва",
    "en": "Battle of Konotop"
  },
  "date": {
    "start": "1659-06-28",
    "end": "1659-06-29",
    "precision": "day"
  },
  "location": "kharkiv-oblast",
  "description": {
    "uk": "Детальний опис події...",
    "en": "Detailed event description..."
  },
  "sources": ["https://example.com/source1", "https://example.com/source2"],
  "media": [
    {
      "type": "image",
      "url": "images/konotop-battle.jpg",
      "caption": {
        "uk": "Підпис до зображення",
        "en": "Image caption"
      }
    }
  ],
  "eras": ["early-modern"],
  "periods": ["hetmanate"],
  "tags": ["military", "cossack"],
  "meta": {
    "contributor": "volunteer-id",
    "created": "2024-01-15T10:30:00Z",
    "verified": true
  }
}
```

### Date Precision Values

- `day` — exact date known (e.g., "1991-08-24")
- `month` — month known (e.g., "1933-03")
- `year` — year known (e.g., "1240")
- `decade` — approximate decade (e.g., "1650s")
- `century` — approximate century (e.g., "10th century")
- `millennium` — approximate millennium (e.g., "3rd millennium BCE")

### Location Structure

```json
{
  "id": "kharkiv-oblast",
  "type": "oblast",
  "coords": [49.9935, 36.2304],
  "names": {
    "uk": "Харківська область",
    "en": "Kharkiv Oblast"
  }
}
```

```json
{
  "id": "constantinople",
  "type": "foreign-city",
  "coords": [41.0082, 28.9784],
  "names": {
    "uk": "Константинополь",
    "en": "Constantinople",
    "modern": {
      "uk": "Стамбул",
      "en": "Istanbul"
    }
  }
}
```

### Location Types

- `oblast` — Ukrainian administrative region (events grouped here)
- `city` — Major Ukrainian city shown separately (e.g., Kyiv, Lviv)
- `foreign-city` — Cities outside modern Ukraine

### Territory Structure (GeoJSON)

```json
{
  "type": "Feature",
  "properties": {
    "id": "hetmanate",
    "names": {
      "uk": "Гетьманщина",
      "en": "Cossack Hetmanate"
    },
    "startYear": 1649,
    "endYear": 1764,
    "color": "#4682B4",
    "opacity": 0.4
  },
  "geometry": {
    "type": "Polygon",
    "coordinates": [[[...]]]
  }
}
```

### UI Translations Structure

```json
{
  "app": {
    "title": "History of Ukraine",
    "subtitle": "Interactive Library"
  },
  "nav": {
    "about": "About",
    "contribute": "Contribute",
    "timeline": "Timeline"
  },
  "eras": {
    "prehistoric": "Prehistoric",
    "ancient": "Ancient",
    "medieval": "Medieval",
    "early-modern": "Early Modern",
    "modern": "Modern",
    "contemporary": "Contemporary"
  },
  "ui": {
    "loading": "Loading...",
    "error": "Loading error",
    "events_count": "{count} events",
    "no_events": "No events for this period",
    "activate_point": "Click to view events",
    "close": "Close"
  }
}
```

## URL Structure

```
https://domain/history/{era}/{date}?points={location1},{location2}
```

Examples:

- `/history/medieval/1240?points=kyiv` — Kyiv events in 1240
- `/history/modern/1933-03?points=kharkiv-oblast,poltava-oblast` — Holodomor events comparing two oblasts
- `/history/contemporary/2022-02-24?points=kyiv,kharkiv-oblast,mariupol` — Full-scale invasion day

Date format adapts to era's timeline scale:

- Prehistoric: `-5000` (5000 BCE)
- Ancient/Medieval: `1240` (year)
- Modern: `1933-03` (month)
- Contemporary: `2022-02-24` (day)

## Contributing

### For Historians and Content Contributors

Use the built-in contribution form at `/contribute` to submit new historical events. The form guides you through:

1. Selecting the appropriate era and period
2. Entering event details in Ukrainian and English
3. Specifying the location (oblast or city)
4. Adding sources and media

Submissions create a Pull Request that is automatically validated and reviewed before merging.

### For Developers

1. Clone the repository
2. Install dependencies: `npm install`
3. Start development server: `npm run dev`
4. Run tests: `npm test`

### Validation Rules

Automated tests ensure data quality:

- All events reference existing locations from `locations.json`
- Required fields are present (`id`, `title`, `date`, `location`)
- All translatable fields have both `uk` and `en` values
- Dates are in valid format matching the specified precision
- Sources array is not empty

## Roadmap

```
Phase 0: Foundation
├── Project setup (monorepo, TypeScript, build pipeline)
├── JSON Schemas for events, locations, territories
├── TypeScript types generation
├── Basic validators (structure, required fields)
├── GitHub Action for PR validation
└── Sample test data (5-10 events for development)

Phase 1: MVP (Map & Timeline)
├── Canvas map renderer with Europe base map
├── Modern Ukraine border overlay
├── Basic timeline with era selector
├── Event points rendering and clustering by location
├── Event detail sidebar
└── URL state management for sharing

Phase 2: Contribution Pipeline
├── Contribution form UI
├── Location selector from dictionary
├── Image upload to repository
├── Form validation (client-side)
├── GitHub PR creation integration
├── Advanced validators (cross-references, duplicates)
└── Form for adding new locations (separate flow)

Phase 3: Historical Visualization
├── Historical territory overlays (clouds)
├── Territory transitions based on timeline
├── Long-duration events visualization
└── Color-coded multi-point comparison

Phase 4: Polish & Scale
├── Mobile responsive design
├── UI translations (full i18n)
├── Performance optimization for large datasets
└── Initial historical data population (with historians)
```

### Future Considerations (Not in Initial Scope)

- Search functionality
- PWA / offline support
- IndexedDB for large datasets
- Additional languages

## License

[To be determined]

## Acknowledgments

This project is built by volunteers passionate about Ukrainian history and education.
