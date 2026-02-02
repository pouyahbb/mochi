export const LinePreview = ({
    startWorld,
    currentWorld
}: {
    startWorld: { x: number; y: number };
    currentWorld: { x: number; y: number };
}) => {
    const { x: startX, y: startY } = startWorld;
    const { x: endX, y: endY } = currentWorld;

    // Calculate bounding box with padding
    const pad = 5;
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
        >
            <line
                x1={lineStartX}
                y1={lineStartY}
                x2={lineEndX}
                y2={lineEndY}
                stroke="#666"
                strokeWidth={2}
                strokeLinecap="round"
                strokeDasharray="3,3"
            />
        </svg>
    );
};

