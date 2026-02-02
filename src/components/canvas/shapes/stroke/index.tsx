import { FreeDrawSahpe } from '@/redux/slice/shapes'
import type { Point } from '@/redux/slice/viewport'

/**
 * Stroke component - renders a freehand drawing path
 * Creates smooth paths from point arrays with proper stroke rendering
 */
export const Stroke = ({ shape }: { shape: FreeDrawSahpe }) => {
    const { points, stroke, strokeWidth } = shape;

    // Early return if no points
    if (!points || points.length === 0) {
        return null;
    }

    // Calculate bounding box
    let minX = Infinity;
    let minY = Infinity;
    let maxX = -Infinity;
    let maxY = -Infinity;

    points.forEach((point: Point) => {
        minX = Math.min(minX, point.x);
        minY = Math.min(minY, point.y);
        maxX = Math.max(maxX, point.x);
        maxY = Math.max(maxY, point.y);
    });

    // Add padding for stroke rendering
    const padding = strokeWidth / 2 + 2;
    const left = minX - padding;
    const top = minY - padding;
    const width = maxX - minX + padding * 2;
    const height = maxY - minY + padding * 2;

    // Convert world coordinates to SVG local coordinates
    const localPoints = points.map((point: Point) => ({
        x: point.x - left,
        y: point.y - top,
    }));

    // Build path string
    // Use quadratic bezier curves for smoother rendering
    let pathData = '';
    if (localPoints.length > 0) {
        pathData = `M ${localPoints[0].x} ${localPoints[0].y}`;

        if (localPoints.length === 1) {
            // Single point - draw a small circle
            pathData += ` L ${localPoints[0].x + 0.1} ${localPoints[0].y}`;
        } else if (localPoints.length === 2) {
            // Two points - draw a line
            pathData += ` L ${localPoints[1].x} ${localPoints[1].y}`;
        } else {
            // Multiple points - use smooth curves
            for (let i = 1; i < localPoints.length; i++) {
                const prev = localPoints[i - 1];
                const curr = localPoints[i];
                const next = localPoints[i + 1];

                if (next) {
                    // Use quadratic bezier for smooth curves
                    const cpX = (curr.x + next.x) / 2;
                    const cpY = (curr.y + next.y) / 2;
                    pathData += ` Q ${curr.x} ${curr.y} ${cpX} ${cpY}`;
                } else {
                    // Last point - line to it
                    pathData += ` L ${curr.x} ${curr.y}`;
                }
            }
        }
    }

    return (
        <svg
            className="absolute pointer-events-none"
            style={{ left, top, width, height }}
            aria-hidden="true"
            viewBox={`0 0 ${width} ${height}`}
        >
            <path
                d={pathData}
                fill="none"
                stroke={stroke}
                strokeWidth={strokeWidth}
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
};
