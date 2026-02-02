import { polylineBox } from '@/lib/utils';
import type { Point } from '@/redux/slice/viewport';

export const StrokePreview = ({
    points
}: {
    points: ReadonlyArray<Point>;
}) => {
    // Early return if no points
    if (!points || points.length < 2) {
        return null;
    }

    const { minX, minY, width, height } = polylineBox(points);
    const pad = 5;
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
                fill="none"
                stroke="#666"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeDasharray="3,3"
            />
        </svg>
    );
};

