// Layout configuration for responsive dashboard
export const BREAKPOINTS = {
  lg: 1200, // Desktop/Laptop
  md: 768,  // Tablet
  sm: 576   // Mobile
} as const;

export const GRID_COLS = {
  lg: 12,
  md: 8,
  sm: 4
} as const;

export const CHART_DIMENSIONS = {
  // Desktop/Laptop dimensions
  lg: {
    minWidth: 400,
    minHeight: 300,
    defaultWidth: 6,  // grid units
    defaultHeight: 6  // grid units
  },
  // Tablet dimensions
  md: {
    minWidth: 300,
    minHeight: 250,
    defaultWidth: 4,  // grid units
    defaultHeight: 6  // grid units
  },
  // Mobile dimensions
  sm: {
    minWidth: 250,
    minHeight: 200,
    defaultWidth: 4,  // grid units (full width on mobile)
    defaultHeight: 5  // grid units
  }
} as const;

export const GRID_CONFIG = {
  rowHeight: 60,
  margin: [16, 16] as [number, number],
  containerPadding: [0, 0] as [number, number],
  compactType: 'vertical' as const,
  preventCollision: false,
  isDraggable: true,
  isResizable: true
} as const;

// Calculate minimum grid units based on dimensions and row height
export const getMinConstraints = (breakpoint: keyof typeof CHART_DIMENSIONS) => {
  const dimensions = CHART_DIMENSIONS[breakpoint];
  return {
    w: Math.ceil(dimensions.minWidth / (1200 / GRID_COLS[breakpoint])), // Approximate grid unit width
    h: Math.ceil(dimensions.minHeight / GRID_CONFIG.rowHeight)
  };
};

// Default layouts for different breakpoints
export const DEFAULT_LAYOUTS = {
  lg: [
    { i: 'revenue-trends', x: 0, y: 0, w: 6, h: 6, minW: 5, minH: 5 },
    { i: 'user-activity', x: 6, y: 0, w: 6, h: 6, minW: 5, minH: 5 },
    { i: 'performance-metrics', x: 0, y: 6, w: 4, h: 6, minW: 3, minH: 5 },
    { i: 'sales-category', x: 4, y: 6, w: 4, h: 6, minW: 3, minH: 5 },
    { i: 'performance-correlation', x: 8, y: 6, w: 4, h: 6, minW: 3, minH: 5 },
    { i: 'marketing-channels', x: 0, y: 12, w: 6, h: 6, minW: 5, minH: 5 },
    { i: 'regional-sales', x: 6, y: 12, w: 6, h: 6, minW: 5, minH: 5 }
  ],
  md: [
    { i: 'revenue-trends', x: 0, y: 0, w: 4, h: 6, minW: 3, minH: 5 },
    { i: 'user-activity', x: 4, y: 0, w: 4, h: 6, minW: 3, minH: 5 },
    { i: 'performance-metrics', x: 0, y: 6, w: 4, h: 6, minW: 3, minH: 5 },
    { i: 'sales-category', x: 4, y: 6, w: 4, h: 6, minW: 3, minH: 5 },
    { i: 'performance-correlation', x: 0, y: 12, w: 4, h: 6, minW: 3, minH: 5 },
    { i: 'marketing-channels', x: 4, y: 12, w: 4, h: 6, minW: 3, minH: 5 },
    { i: 'regional-sales', x: 0, y: 18, w: 8, h: 6, minW: 4, minH: 5 }
  ],
  sm: [
    { i: 'revenue-trends', x: 0, y: 0, w: 4, h: 5, minW: 4, minH: 4 },
    { i: 'user-activity', x: 0, y: 5, w: 4, h: 5, minW: 4, minH: 4 },
    { i: 'performance-metrics', x: 0, y: 10, w: 4, h: 5, minW: 4, minH: 4 },
    { i: 'sales-category', x: 0, y: 15, w: 4, h: 5, minW: 4, minH: 4 },
    { i: 'performance-correlation', x: 0, y: 20, w: 4, h: 5, minW: 4, minH: 4 },
    { i: 'marketing-channels', x: 0, y: 25, w: 4, h: 5, minW: 4, minH: 4 },
    { i: 'regional-sales', x: 0, y: 30, w: 4, h: 5, minW: 4, minH: 4 }
  ]
};