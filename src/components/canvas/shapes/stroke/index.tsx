import { polylineBox } from '@/lib/utils';
import { FreeDrawSahpe } from '@/redux/slice/shapes'

/**
 * Stroke component - renders a freehand drawing path
 * Creates smooth paths from point arrays with proper stroke rendering
 */
export const Stroke = ({ shape }: { shape: FreeDrawSahpe }) => {
    const { points, stroke, strokeWidth, fill } = shape;

    // Early return if no points
    if (!points || points.length < 2) {
        return null;
    }

    const { minX, minY, width, height } = polylineBox(points);
    const pad = strokeWidth;
    const svgWidth = width + pad * 2;
    const svgHeight = height + pad * 2;

    // Convert world coordinates to SVG local coordinates with padding
    const dpts = points.map(p => `${p.x - minX + pad},${p.y - minY + pad}`).join(" ");

    return (
        <svg
            className="absolute pointer-events-none"
            style={{ 
                left: minX - pad, 
                top: minY - pad, 
                width: svgWidth, 
                height: svgHeight 
            }}
            aria-hidden="true"
            viewBox={`0 0 ${svgWidth} ${svgHeight}`}
        >
            <polyline
                points={dpts}
                fill={fill || "none"}
                stroke={stroke}
                strokeWidth={strokeWidth}
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
};
