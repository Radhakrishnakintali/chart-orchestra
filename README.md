# Advanced Analytics Dashboard

A powerful, modular React-based dashboard featuring dynamic charts, data filtering, export capabilities, and beautiful responsive design.

![Dashboard Preview](https://via.placeholder.com/800x400/4A90E2/FFFFFF?text=Advanced+Analytics+Dashboard)

## ✨ Features

### 📊 Multiple Chart Types
- **Line Charts** - Revenue trends and time series data
- **Bar Charts** - Performance metrics and categorical comparisons  
- **Area Charts** - Stacked user activity visualization
- **Pie Charts** - Sales distribution by category
- **Scatter Plots** - Performance correlation analysis
- **Radar Charts** - Multi-dimensional marketing channel analysis

### 🎛️ Advanced Filtering
- **Global Date Range Filter** - Apply date filters to all charts simultaneously
- **Per-Chart Date Filters** - Individual chart-level date filtering
- **Real-time Data Updates** - Dynamic data filtering and visualization

### 📤 Export Capabilities
- **Excel Export (.xlsx)** - Export chart data to Excel format
- **CSV Export** - Export data in CSV format
- **Print Functionality** - Print individual charts or entire dashboard
- **Modal View** - Maximize charts for detailed analysis

### 🎨 Modern Design
- **Responsive Layout** - Optimized for desktop, tablet, and mobile
- **Dark/Light Theme Ready** - Built with semantic design tokens
- **Beautiful Animations** - Smooth transitions and interactions
- **Professional UI** - Clean, modern interface with shadcn/ui components

### ⚡ Performance Features
- **Offline Functionality** - Works with mock data for development
- **Fast Loading** - Optimized React components with memoization
- **TypeScript** - Full type safety and better developer experience
- **Modular Architecture** - Easy to extend and maintain

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ 
- npm or yarn

### Installation & Setup

```bash
# Clone the repository
git clone <your-repo-url>
cd advanced-dashboard

# Install dependencies
npm install

# Start development server
npm run dev
```

The dashboard will be available at `http://localhost:8080`

### 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # Shadcn/UI base components
│   ├── Dashboard.tsx   # Main dashboard container
│   ├── DashboardHeader.tsx # Global controls
│   └── ChartContainer.tsx  # Chart wrapper with actions
├── charts/             # Chart implementations
│   ├── AreaChart.tsx
│   ├── BarChart.tsx
│   ├── LineChart.tsx
│   ├── PieChart.tsx
│   ├── RadarChart.tsx
│   └── ScatterChart.tsx
├── hooks/              # Custom React hooks
│   ├── useDateFilter.ts
│   └── useDashboardData.ts
├── utils/              # Utility functions
│   └── exportUtils.ts
└── pages/              # Route components
    └── Index.tsx

public/
└── mock/               # Mock data for offline mode
    └── dashboard-data.json
```

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
