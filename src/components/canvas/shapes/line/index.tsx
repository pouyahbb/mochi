import { LineShape } from '@/redux/slice/shapes'

/**
 * Line component - renders a straight line between two points
 * Supports precise stroke rendering with proper bounding box calculation
 */
export const Line = ({ shape }: { shape: LineShape }) => {
    const { startX, startY, endX, endY, stroke, strokeWidth } = shape;

    // Calculate bounding box with padding for stroke rendering
    const pad = Math.max(strokeWidth / 2 + 2, 5);
    const minX = Math.min(startX, endX) - pad;
    const minY = Math.min(startY, endY) - pad;
    const maxX = Math.max(startX, endX) + pad;
    const maxY = Math.max(startY, endY) + pad;
    const width = maxX - minX;
    const height = maxY - minY;

    // Convert world coordinates to SVG local coordinates
    const lineStartX = startX - minX;
    const lineStartY = startY - minY;
    const lineEndX = endX - minX;
    const lineEndY = endY - minY;

    return (
        <svg
            className="absolute pointer-events-none"
            style={{ left: minX, top: minY, width, height }}
            aria-hidden="true"
            viewBox={`0 0 ${width} ${height}`}
        >
            <line
                x1={lineStartX}
                y1={lineStartY}
                x2={lineEndX}
                y2={lineEndY}
                stroke={stroke}
                strokeWidth={strokeWidth}
                strokeLinecap="round"
            />
        </svg>
    );
};
