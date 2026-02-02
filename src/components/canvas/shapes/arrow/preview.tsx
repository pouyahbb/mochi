const calculateArrowHead = (
    startX: number,
    startY: number,
    endX: number,
    endY: number,
    size: number = 10
) => {
    const angle = Math.atan2(endY - startY, endX - startX);
    const arrowAngle = Math.PI / 6;

    const x1 = endX - size * Math.cos(angle - arrowAngle);
    const y1 = endY - size * Math.sin(angle - arrowAngle);
    const x2 = endX - size * Math.cos(angle + arrowAngle);
    const y2 = endY - size * Math.sin(angle + arrowAngle);

    return { x1, y1, x2, y2 };
};

export const ArrowPreview = ({
    startWorld,
    currentWorld
}: {
    startWorld: { x: number; y: number };
    currentWorld: { x: number; y: number };
}) => {
    const { x: startX, y: startY } = startWorld;
    const { x: endX, y: endY } = currentWorld;
    const arrowHead = calculateArrowHead(startX, startY, endX, endY, 12);

    // Calculate bounding box with padding for proper rendering
    const minX = Math.min(startX, endX, arrowHead.x1, arrowHead.x2) - 5;
    const minY = Math.min(startY, endY, arrowHead.y1, arrowHead.y2) - 5;
    const maxX = Math.max(startX, endX, arrowHead.x1, arrowHead.x2) + 5;
    const maxY = Math.max(startY, endY, arrowHead.y1, arrowHead.y2) + 5;
    const width = maxX - minX;
    const height = maxY - minY;

    // Convert world coordinates to SVG local coordinates
    const lineStartX = startX - minX;
    const lineStartY = startY - minY;
    const lineEndX = endX - minX;
    const lineEndY = endY - minY;
    const headX1 = arrowHead.x1 - minX;
    const headY1 = arrowHead.y1 - minY;
    const headX2 = arrowHead.x2 - minX;
    const headY2 = arrowHead.y2 - minY;

    return (
        <svg
            className="absolute pointer-events-none"
            style={{ left: minX, top: minY, width, height }}
            aria-hidden="true"
            viewBox={`0 0 ${width} ${height}`}
        >
            {/* Main arrow line */}
            <line
                x1={lineStartX}
                y1={lineStartY}
                x2={lineEndX}
                y2={lineEndY}
                stroke="#666"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeDasharray="3,3"
            />

            {/* Arrowhead triangle */}
            <polygon
                points={`${lineEndX},${lineEndY} ${headX1},${headY1} ${headX2},${headY2}`}
                fill="#666"
                stroke="#666"
                strokeWidth={1}
                strokeLinejoin="round"
                strokeDasharray="2,2"
            />
        </svg>
    );
};