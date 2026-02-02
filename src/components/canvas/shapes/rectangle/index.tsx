import { RectShape } from '@/redux/slice/shapes'

/**
 * Rectangle component - renders a rectangle shape with stroke and fill
 * Supports both filled and outlined rectangles with precise positioning
 */
export const Rectangle = ({ shape }: { shape: RectShape }) => {
    const { x, y, w, h, fill, stroke, strokeWidth } = shape;

    // Calculate absolute dimensions and position (handle negative width/height)
    const width = Math.abs(w);
    const height = Math.abs(h);
    const left = w < 0 ? x + w : x;
    const top = h < 0 ? y + h : y;

    // Build SVG path for rectangle
    const pathData = `M ${strokeWidth / 2} ${strokeWidth / 2} L ${width - strokeWidth / 2} ${strokeWidth / 2} L ${width - strokeWidth / 2} ${height - strokeWidth / 2} L ${strokeWidth / 2} ${height - strokeWidth / 2} Z`;

    return (
        <svg
            className="absolute pointer-events-none"
            style={{ left, top, width, height }}
            aria-hidden="true"
            viewBox={`0 0 ${width} ${height}`}
        >
            {/* Fill layer */}
            {fill && (
                <rect
                    x={strokeWidth / 2}
                    y={strokeWidth / 2}
                    width={width - strokeWidth}
                    height={height - strokeWidth}
                    fill={fill}
                />
            )}

            {/* Stroke layer */}
            {strokeWidth > 0 && (
                <path
                    d={pathData}
                    fill="none"
                    stroke={stroke}
                    strokeWidth={strokeWidth}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
            )}
        </svg>
    );
};
