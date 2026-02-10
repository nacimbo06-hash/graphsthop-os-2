/**
 * Lazy Recharts Components
 * 
 * Dynamic imports for Recharts to reduce initial bundle size.
 * Recharts is ~660KB - by lazy loading, we defer this cost until charts are actually rendered.
 */

import React, { lazy, Suspense, ComponentType } from 'react';

// Loading placeholder for charts
const ChartPlaceholder: React.FC<{ height?: number }> = ({ height = 300 }) => (
    <div
        style={{
            height,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'var(--bg-secondary, #1e293b)',
            borderRadius: '8px',
            color: 'var(--text-secondary, #94a3b8)'
        }}
    >
        <div className="spinner" style={{ width: 24, height: 24 }}></div>
    </div>
);

// Lazy-loaded chart components
export const LazyAreaChart = lazy(() =>
    import('recharts').then(m => ({ default: m.AreaChart as ComponentType<any> }))
);

export const LazyBarChart = lazy(() =>
    import('recharts').then(m => ({ default: m.BarChart as ComponentType<any> }))
);

export const LazyLineChart = lazy(() =>
    import('recharts').then(m => ({ default: m.LineChart as ComponentType<any> }))
);

export const LazyPieChart = lazy(() =>
    import('recharts').then(m => ({ default: m.PieChart as ComponentType<any> }))
);

export const LazyComposedChart = lazy(() =>
    import('recharts').then(m => ({ default: m.ComposedChart as ComponentType<any> }))
);

// Re-export commonly used non-lazy components (these are small)
export {
    ResponsiveContainer,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    Area,
    Bar,
    Line,
    Pie,
    Cell,
    ReferenceLine
} from 'recharts';

// Wrapper component for lazy charts with built-in Suspense
interface LazyChartWrapperProps {
    children: React.ReactNode;
    height?: number;
}

export const LazyChartWrapper: React.FC<LazyChartWrapperProps> = ({
    children,
    height = 300
}) => (
    <Suspense fallback={<ChartPlaceholder height={height} />}>
        {children}
    </Suspense>
);
