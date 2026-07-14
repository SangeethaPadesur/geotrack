# GeoTrack

A high-performance real-time fleet tracking application built with React, TypeScript, and Leaflet. Optimized for rendering thousands of moving coordinates without performance degradation.

## Features

- **Real-time Fleet Tracking**: 500+ moving vehicles with live position updates
- **Dynamic Geolocation**: Automatically centers map on user's location
- **Performance Optimized**: State throttling, viewport culling, and efficient marker rendering for smooth 60+ FPS
- **Interactive Controls**: Filter by status, fly to specific locations
- **Real-time FPS Counter**: Built-in performance monitoring
- **Responsive Design**: Dark-themed dashboard with modern UI

## Tech Stack

- **Framework**: React 19 + TypeScript
- **Build Tool**: Vite
- **Map Engine**: React-Leaflet + Leaflet.js
- **Styling**: Tailwind CSS v4
- **Map Tiles**: OpenStreetMap (free, no API key required)

## Architecture

### Performance Optimization Strategy

Rendering thousands of moving coordinates on a map can quickly freeze a standard React application. GeoTrack implements three key optimizations:

#### 1. State Throttling

The `useFleetStream` hook implements a dual-buffer architecture:

- **Memory Buffer**: High-frequency updates (every 100ms) occur purely in memory using a `useRef` buffer
- **UI State Flush**: Updates are batched and flushed to React state every 400ms

This prevents React from re-rendering on every single position update, maintaining smooth 60 FPS performance.

```typescript
// High-frequency memory updates (100ms)
const streamInterval = setInterval(() => {
  fleetRef.current = fleetRef.current.map((driver) => ({
    ...driver,
    position: [/* updated coords */]
  }));
}, 100);

// Batched UI flush (400ms)
const uiInterval = setInterval(() => {
  setFleet([...fleetRef.current]);
}, 400);
```

#### 2. Viewport Culling

Only markers visible within the current map viewport are rendered. The map bounds are tracked on move and zoom events, and the fleet is filtered to include only drivers within the visible area. This dramatically reduces the number of components that need to be rendered, especially at higher zoom levels.

```typescript
const filteredFleet = useMemo(() => {
  let result = fleet;
  if (activeFilter !== "all") {
    result = result.filter((driver) => driver.status === activeFilter);
  }
  if (bounds) {
    result = result.filter((driver) => {
      const lat = driver.position[0];
      const lng = driver.position[1];
      return lat >= bounds.getSouth() && lat <= bounds.getNorth() &&
             lng >= bounds.getWest() && lng <= bounds.getEast();
    });
  }
  return result;
}, [fleet, activeFilter, bounds]);
```

#### 3. Efficient Marker Rendering

The map uses `CircleMarker` components instead of custom DOM-based markers. CircleMarker is more performant as it renders directly on the map canvas rather than creating individual DOM elements for each marker. Combined with `preferCanvas={true}`, this ensures optimal rendering performance.

### Component Structure

```
src/
├── App.tsx                 # Main layout, sidebar controls
├── Map.tsx                 # Map container, markers, popups
├── hooks/
│   └── useFleetStream.ts   # Fleet data stream with throttling
└── index.css               # Global styles
```

### Data Flow

1. **Geolocation**: Browser API fetches user coordinates
2. **Fleet Generation**: 500 mock drivers spawned around user location
3. **Position Updates**: Drivers move randomly every 100ms (memory buffer)
4. **UI Updates**: Position changes flushed to React every 400ms
5. **Viewport Filtering**: Only markers within visible map bounds are rendered
6. **Rendering**: Map renders filtered fleet using CircleMarker components

## Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## Key Implementation Details

### Custom Hook: `useFleetStream`

- Generates initial fleet of 500 drivers centered on user coordinates
- Implements memory buffer for high-frequency position updates
- Batches UI updates to prevent excessive re-renders
- Handles geolocation permission with fallback to London coordinates

### Map Component

- Uses React-Leaflet for map rendering
- CircleMarker components for efficient rendering with status-based colors (green=active, yellow=idle, red=delayed)
- `MapController` handles dynamic camera realignment, flyTo animations, and viewport bounds tracking
- Canvas rendering enabled for optimal performance
- Real-time FPS counter for performance monitoring

### Filter System

- Filter drivers by status (all, active, idle, delayed)
- Real-time filtering with useMemo optimization
- "Track Regional Center Hub" button flies map to user's location

## Performance Metrics

- **Fleet Size**: 500 drivers
- **Update Frequency**: 100ms (memory), 400ms (UI)
- **Target FPS**: 60+ FPS
- **Rendering**: CircleMarker with viewport culling
- **Optimizations**: State throttling, viewport culling, canvas rendering

## License

MIT
