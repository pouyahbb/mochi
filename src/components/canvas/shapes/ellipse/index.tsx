import { EllipseShape } from '@/redux/slice/shapes'

/**
 * Ellipse component - renders an ellipse or circle shape with stroke and fill
 * Supports both filled and outlined ellipses with precise positioning
 */
export const Ellipse = ({ shape }: { shape: EllipseShape }) => {
    const { x, y, w, h, fill, stroke, strokeWidth } = shape;

    // Calculate absolute dimensions and position (handle negative width/height)
    const width = Math.abs(w);
    const height = Math.abs(h);
    const left = w < 0 ? x + w : x;
    const top = h < 0 ? y + h : y;

    // Calculate center and radii for the ellipse
    const centerX = width / 2;
    const centerY = height / 2;
    const radiusX = (width - strokeWidth) / 2;
    const radiusY = (height - strokeWidth) / 2;

    return (
        <svg
            className="absolute pointer-events-none"
            style={{ left, top, width, height }}
            aria-hidden="true"
            viewBox={`0 0 ${width} ${height}`}
        >
            {/* Fill layer */}
            {fill && (
                <ellipse
                    cx={centerX}
                    cy={centerY}
                    rx={radiusX}
                    ry={radiusY}
                    fill={fill}
                />
            )}

            {/* Stroke layer */}
            {strokeWidth > 0 && (
                <ellipse
                    cx={centerX}
                    cy={centerY}
                    rx={radiusX}
                    ry={radiusY}
                    fill="none"
                    stroke={stroke}
                    strokeWidth={strokeWidth}
                    strokeLinecap="round"
                />
            )}
        </svg>
    );
};
