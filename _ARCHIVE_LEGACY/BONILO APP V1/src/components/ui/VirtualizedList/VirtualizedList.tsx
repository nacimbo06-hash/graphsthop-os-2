/**
 * VirtualizedList Component
 * 
 * A wrapper around react-virtuoso for rendering large lists efficiently.
 * Only renders items that are visible in the viewport.
 */

import React, { ReactNode, useMemo } from 'react';
import { Virtuoso, VirtuosoGrid, VirtuosoProps, VirtuosoGridProps } from 'react-virtuoso';

// ===== VIRTUALIZED LIST =====

interface VirtualizedListProps<T> extends Omit<VirtuosoProps<T, any>, 'data' | 'itemContent'> {
    data: T[];
    renderItem: (index: number, item: T) => ReactNode;
    itemHeight?: number;
    overscan?: number;
    emptyMessage?: string;
}

export function VirtualizedList<T>({
    data,
    renderItem,
    itemHeight,
    overscan = 5,
    emptyMessage = 'Aucun élément',
    style,
    ...rest
}: VirtualizedListProps<T>) {
    if (data.length === 0) {
        return (
            <div style={{
                padding: '2rem',
                textAlign: 'center',
                color: 'var(--text-secondary, #94a3b8)'
            }}>
                {emptyMessage}
            </div>
        );
    }

    return (
        <Virtuoso
            data={data}
            overscan={overscan}
            itemContent={(index, item) => renderItem(index, item)}
            style={{ height: '100%', ...style }}
            fixedItemHeight={itemHeight}
            {...rest}
        />
    );
}

// ===== VIRTUALIZED GRID =====

interface VirtualizedGridProps<T> {
    data: T[];
    renderItem: (index: number, item: T) => ReactNode;
    columns?: number;
    gap?: number;
    itemHeight?: number;
    emptyMessage?: string;
    style?: React.CSSProperties;
}

export function VirtualizedGrid<T>({
    data,
    renderItem,
    columns = 4,
    gap = 16,
    itemHeight = 200,
    emptyMessage = 'Aucun élément',
    style,
}: VirtualizedGridProps<T>) {
    const listStyle = useMemo(() => ({
        display: 'grid',
        gridTemplateColumns: `repeat(${columns}, 1fr)`,
        gap: `${gap}px`,
    }), [columns, gap]);

    const itemStyle = useMemo(() => ({
        height: itemHeight,
    }), [itemHeight]);

    if (data.length === 0) {
        return (
            <div style={{
                padding: '2rem',
                textAlign: 'center',
                color: 'var(--text-secondary, #94a3b8)'
            }}>
                {emptyMessage}
            </div>
        );
    }

    return (
        <VirtuosoGrid
            data={data}
            listClassName="virtuoso-grid-list"
            itemClassName="virtuoso-grid-item"
            itemContent={(index) => renderItem(index, data[index])}
            style={{ height: '100%', ...style }}
            components={{
                List: React.forwardRef<HTMLDivElement, { style?: React.CSSProperties; children?: ReactNode }>(
                    ({ style: listStyleProp, children }, ref) => (
                        <div ref={ref} style={{ ...listStyleProp, ...listStyle }}>
                            {children}
                        </div>
                    )
                ),
                Item: ({ children, ...props }: { children?: ReactNode }) => (
                    <div {...props} style={itemStyle}>
                        {children}
                    </div>
                ),
            }}
        />
    );
}

export default VirtualizedList;
