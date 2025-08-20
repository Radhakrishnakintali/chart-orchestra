# Responsive Dashboard with React Grid Layout

A comprehensive React dashboard with draggable, resizable charts that automatically adapt to different screen sizes while maintaining minimum readability constraints.

![Dashboard Preview](https://via.placeholder.com/800x400/4A90E2/FFFFFF?text=Advanced+Analytics+Dashboard)

## Features

### 📊 Interactive Dashboard
- **Drag & Drop**: Rearrange charts using `react-grid-layout`
- **Resizable Charts**: Resize charts while respecting minimum dimensions
- **Responsive Design**: Automatic layout adaptation for Desktop, Tablet, and Mobile

### 📱 Responsive Breakpoints
- **Desktop/Laptop** (≥1200px): Min 400×300px chart cards
- **Tablet** (768-1199px): Min 300×250px chart cards  
- **Mobile** (<768px): Min 250×200px chart cards

### 🎛️ Chart Controls
- **Kebab Menu**: Date filter, print, and export options per chart
- **Maximize/Minimize**: Toggle full-screen chart view
- **Date Filtering**: Per-chart date range selection with modal
- **Export Options**: CSV and Excel download per chart

### 📈 Chart Types
- Line Charts (Revenue trends)
- Area Charts (User activity) 
- Bar Charts (Performance metrics, Regional sales)
- Pie Charts (Sales by category)
- Scatter Charts (Performance correlation)
- Radar Charts (Marketing channels)

## Tech Stack

- **React 18** with TypeScript
- **Recharts** for data visualization
- **react-grid-layout** for drag & resize functionality
- **Tailwind CSS** with custom design system
- **Shadcn/ui** components
- **date-fns** for date handling

## Installation & Setup

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## Project Structure

```
src/
├── components/
│   ├── ui/              # Shadcn UI components
│   ├── Dashboard.tsx    # Main dashboard layout
│   ├── ChartContainer.tsx # Chart wrapper with controls
│   └── DashboardHeader.tsx
├── charts/              # Individual chart components
│   ├── LineChart.tsx
│   ├── BarChart.tsx
│   ├── AreaChart.tsx
│   ├── PieChart.tsx
│   ├── ScatterChart.tsx
│   └── RadarChart.tsx
├── config/
│   └── layout.ts        # Responsive layout configuration
├── hooks/               # Custom React hooks
│   ├── useDashboardData.ts
│   └── useDateFilter.ts
├── styles/
│   └── react-grid-layout.css # Grid layout styles
└── utils/
    └── exportUtils.ts   # CSV/Excel export utilities
```

## Responsive Layout Architecture

### Layout Configuration (`src/config/layout.ts`)

The responsive behavior is controlled by centralized configuration:

```typescript
export const CHART_DIMENSIONS = {
  lg: { minWidth: 400, minHeight: 300 },  // Desktop
  md: { minWidth: 300, minHeight: 250 },  // Tablet  
  sm: { minWidth: 250, minHeight: 200 }   // Mobile
};
```

### Breakpoint System

- **CSS Custom Properties**: Dynamic minimum dimensions via CSS variables
- **Grid Constraints**: Minimum grid units prevent charts from becoming unreadable
- **Responsive Layouts**: Different default layouts per breakpoint

### Drag & Resize Constraints

Charts maintain minimum readable dimensions during:
- Initial render based on screen size
- User dragging and resizing
- Layout changes from maximize/minimize
- Date filter applications

## Key Features Implementation

### 1. Responsive Chart Cards
```css
.react-grid-item {
  min-width: var(--chart-min-width, 250px);
  min-height: var(--chart-min-height, 200px);
}
```

### 2. Breakpoint-Specific Constraints
```typescript
const getMinConstraints = (breakpoint) => ({
  w: Math.ceil(dimensions.minWidth / gridUnitWidth),
  h: Math.ceil(dimensions.minHeight / rowHeight)
});
```

### 3. Per-Chart Date Filtering
Each chart maintains its own date range state while respecting global dashboard filters.

### 4. Export Functionality
- **CSV Export**: Raw data export with date formatting
- **Excel Export**: Formatted spreadsheet with chart metadata
- **Print**: Optimized chart printing with responsive layout

## Development Guidelines

### Adding New Charts
1. Create chart component in `src/charts/`
2. Add chart configuration to `Dashboard.tsx`
3. Update `DEFAULT_LAYOUTS` in `src/config/layout.ts`

### Customizing Responsive Behavior
- Modify `CHART_DIMENSIONS` for different minimum sizes
- Update `BREAKPOINTS` for custom screen size targets
- Adjust `DEFAULT_LAYOUTS` for optimal chart arrangements

### Styling Guidelines
- Use Tailwind semantic tokens from `index.css`
- Maintain HSL color format for theme consistency
- Update CSS custom properties for responsive behavior

## Performance Considerations

- **Lazy Loading**: Charts render only when visible
- **Memoized Components**: Prevent unnecessary re-renders
- **Optimized Layouts**: Efficient grid calculations
- **Debounced Resize**: Smooth dragging performance

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## 🎯 Usage Examples

### Adding a New Chart

```typescript
// 1. Create your chart component
import { LineChart } from '@/charts/LineChart';

// 2. Add to dashboard
<ChartContainer 
  title="Custom Metrics" 
  data={yourData}
  enableLocalDateFilter={true}
>
  <LineChart 
    data={filteredData}
    dataKeys={['metric1', 'metric2']}
    colors={['hsl(var(--chart-primary))', 'hsl(var(--chart-secondary))']}
  />
</ChartContainer>
```

### Custom Data Integration

```typescript
// Replace mock data with your API
const { data, loading, error } = useDashboardData();

// Or customize the hook for your data source
const useDashboardData = () => {
  const [data, setData] = useState(null);
  
  useEffect(() => {
    fetch('/api/dashboard-data')
      .then(response => response.json())
      .then(setData);
  }, []);
  
  return { data, loading: !data, error: null };
};
```

### Date Filtering

```typescript
// Global date filtering
const { dateRange, setDateRange, filterDataByDate } = useDateFilter();

// Apply to any data array
const filteredRevenue = filterDataByDate(revenueData);
```

### Export Functionality

```typescript
import { exportToExcel, exportToCSV } from '@/utils/exportUtils';

// Export chart data
const handleExport = () => {
  exportToExcel(chartData, 'revenue-report');
  exportToCSV(chartData, 'revenue-data');
};
```

## 🛠️ Customization

### Color Scheme
Customize the dashboard colors in `src/index.css`:

```css
:root {
  --chart-primary: 217 91% 60%;      /* Blue */
  --chart-secondary: 267 84% 65%;    /* Purple */  
  --chart-accent: 32 95% 44%;        /* Orange */
  /* Add your custom colors */
}
```

### Chart Configuration
Each chart component accepts customizable props:

```typescript
<LineChart
  data={data}
  dataKeys={['revenue', 'profit']}
  colors={['#4A90E2', '#50C878']}
  height={400}
  xAxisKey="date"
/>
```

### Layout Modifications
Adjust the grid layout in `Dashboard.tsx`:

```typescript
{/* 2-column layout */}
<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
  
{/* 3-column layout */}  
<div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
```

## 📊 Data Format

The dashboard expects data in the following format:

```json
{
  "revenue": [
    { "date": "2024-01-01", "value": 45000, "category": "Sales" }
  ],
  "userActivity": [
    { "date": "2024-01-01", "activeUsers": 1250, "newUsers": 180 }
  ],
  "salesByCategory": [
    { "name": "Electronics", "value": 450000, "percentage": 35 }
  ]
}
```

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm run test:watch
```

## 📚 Documentation

- **[Architecture Guide](./ARCHITECTURE.md)** - Detailed technical documentation
- **[Component API](./docs/components.md)** - Component usage and props
- **[Data Integration](./docs/data.md)** - How to connect your data sources
- **[Theming Guide](./docs/theming.md)** - Customization and styling

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Recharts](https://recharts.org/) - Beautiful React charts
- [Shadcn/UI](https://ui.shadcn.com/) - High-quality UI components
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [Lucide Icons](https://lucide.dev/) - Beautiful icon library

## 📞 Support

For support and questions:
- 📧 Email: support@yourdomain.com
- 💬 Discord: [Join our community](https://discord.gg/yourinvite)
- 📖 Docs: [Documentation site](https://docs.yourdomain.com)

---

**Built with ❤️ using React, TypeScript, and modern web technologies**
