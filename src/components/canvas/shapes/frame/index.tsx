import { FrameShape } from '@/redux/slice/shapes'

/**
 * Frame component - renders a container frame with background and optional border
 * Frames are typically used as containers for grouping other elements
 */
export const Frame = ({ 
    shape, 
    toggleInspiration 
}: { 
    shape: FrameShape
    toggleInspiration: () => void 
}) => {
    const { x, y, w, h, fill, stroke, strokeWidth } = shape;

    // Ensure positive dimensions
    const width = Math.abs(w);
    const height = Math.abs(h);
    const left = w < 0 ? x + w : x;
    const top = h < 0 ? y + h : y;

    return (
        <div
            className="absolute pointer-events-none"
            style={{
                left,
                top,
                width,
                height,
                backgroundColor: fill || undefined,
                borderColor: stroke !== 'transparent' ? stroke : undefined,
                borderWidth: strokeWidth > 0 ? `${strokeWidth}px` : undefined,
                borderStyle: strokeWidth > 0 ? 'solid' : undefined,
                boxSizing: 'border-box',
            }}
            aria-label={`Frame ${shape.frameNumber}`}
            role="region"
        />
    );
};
