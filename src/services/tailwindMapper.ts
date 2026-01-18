/**
 * Maps pixel values to Tailwind CSS classes
 * Pure, deterministic functions only - NO AI
 */

// Tailwind spacing scale (in px at 16px base)
// Each Tailwind unit = 0.25rem = 4px
// Scale: 0, 0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 5, 6, 7, 8, 9, 10, 11, 12, 14, 16, 20, 24, 28, 32, 36, 40, 44, 48, 52, 56, 60, 64, 72, 80, 96
const SPACING_SCALE_PX = [
    0, 2, 4, 6, 8, 10, 12, 14, 16, 20, 24, 28, 32, 36, 40, 44, 48, 52, 56, 60, 64, 72, 80, 96
];

// Tailwind spacing scale (unit names)
const SPACING_UNITS = [
    '0', '0.5', '1', '1.5', '2', '2.5', '3', '3.5', '4', '5', '6', '7', '8', '9', '10', '11', '12', '14', '16', '20', '24', '28', '32', '36', '40', '44', '48', '52', '56', '60', '64', '72', '80', '96'
];

// Tailwind text sizes (font-size in px)
const TEXT_SIZE_SCALE: { [key: string]: number } = {
    'xs': 12,
    'sm': 14,
    'base': 16,
    'lg': 18,
    'xl': 20,
    '2xl': 24,
    '3xl': 30,
    '4xl': 36,
    '5xl': 48,
    '6xl': 60,
    '7xl': 72,
    '8xl': 96,
    '9xl': 128
};

// Tailwind border radius scale (border-radius in px)
const RADIUS_SCALE: { [key: string]: number } = {
    'none': 0,
    'sm': 2,
    'DEFAULT': 4,
    'md': 6,
    'lg': 8,
    'xl': 12,
    '2xl': 16,
    '3xl': 24,
    'full': 9999
};

/**
 * Finds the closest value in an array using binary search for efficiency
 * Optimized nearest-value algorithm for Tailwind mapping
 */
function findClosestIndex(value: number, scale: number[]): number {
    if (scale.length === 0) return 0;
    if (scale.length === 1) return 0;

    // Binary search for closest value
    let left = 0;
    let right = scale.length - 1;
    let closestIndex = 0;
    let closestDiff = Math.abs(scale[0] - value);

    // Handle edge cases
    if (value <= scale[0]) return 0;
    if (value >= scale[right]) return right;

    // Binary search
    while (left <= right) {
        const mid = Math.floor((left + right) / 2);
        const diff = Math.abs(scale[mid] - value);

        if (diff < closestDiff) {
            closestDiff = diff;
            closestIndex = mid;
        }

        if (scale[mid] < value) {
            left = mid + 1;
        } else {
            right = mid - 1;
        }
    }

    // Check neighbors for true nearest
    const neighbors = [
        closestIndex - 1,
        closestIndex,
        closestIndex + 1
    ].filter(i => i >= 0 && i < scale.length);

    for (const idx of neighbors) {
        const diff = Math.abs(scale[idx] - value);
        if (diff < closestDiff) {
            closestDiff = diff;
            closestIndex = idx;
        }
    }

    return closestIndex;
}

/**
 * Finds the closest key in an object by comparing values
 */
function findClosestKey(value: number, scale: { [key: string]: number }): string {
    const entries = Object.entries(scale);
    let closestKey = entries[0][0];
    let closestDiff = Math.abs(entries[0][1] - value);

    for (const [key, scaleValue] of entries) {
        const diff = Math.abs(scaleValue - value);
        if (diff < closestDiff) {
            closestDiff = diff;
            closestKey = key;
        }
    }

    return closestKey;
}

/**
 * Converts pixel spacing value to Tailwind spacing class suffix
 * Maps px → nearest Tailwind spacing value
 * @param px - Pixel value
 * @returns Tailwind spacing suffix (e.g., '0', '4', '8', '16', '-4' for negative)
 */
export function spacingToTailwind(px: number): string {
    // Handle negative values
    const isNegative = px < 0;
    const absPx = Math.abs(px);

    // Find closest spacing value
    const closestIndex = findClosestIndex(absPx, SPACING_SCALE_PX);
    const closestUnit = SPACING_UNITS[closestIndex];

    return isNegative ? `-${closestUnit}` : closestUnit;
}

/**
 * Converts pixel font size to Tailwind text size class
 * Maps fontSize → Tailwind text class
 * @param px - Font size in pixels
 * @returns Tailwind text size class (e.g., 'text-sm', 'text-xl', 'text-2xl')
 */
export function fontSizeToTailwind(px: number): string {
    const closestKey = findClosestKey(px, TEXT_SIZE_SCALE);
    return `text-${closestKey}`;
}

/**
 * Converts pixel border radius to Tailwind rounded class
 * Maps borderRadius → rounded class
 * @param px - Border radius in pixels
 * @returns Tailwind rounded class (e.g., 'rounded-sm', 'rounded-lg', 'rounded-full')
 */
export function radiusToTailwind(px: number): string {
    // Very large radius becomes rounded-full
    if (px >= 1000) {
        return 'rounded-full';
    }

    const closestKey = findClosestKey(px, RADIUS_SCALE);

    // Handle DEFAULT case
    if (closestKey === 'DEFAULT') {
        return 'rounded';
    }

    return `rounded-${closestKey}`;
}

/**
 * Enhanced nearest-value algorithm with tolerance threshold
 * Only maps if within acceptable tolerance range
 * @param value - Pixel value to map
 * @param scale - Array of scale values
 * @param tolerance - Maximum acceptable difference (default: 50% of closest value)
 * @returns Nearest value or null if outside tolerance
 */
export function findNearestWithTolerance(
    value: number,
    scale: number[],
    tolerance?: number
): number | null {
    if (scale.length === 0) return null;

    const closestIndex = findClosestIndex(value, scale);
    const closestValue = scale[closestIndex];
    const diff = Math.abs(closestValue - value);

    // Default tolerance: 50% of closest value, minimum 2px
    const defaultTolerance = Math.max(closestValue * 0.5, 2);
    const maxDiff = tolerance ?? defaultTolerance;

    if (diff > maxDiff) {
        return null; // Outside tolerance
    }

    return closestValue;
}
