/**
 * Responsive breakpoint utilities
 * Tailwind default breakpoints: sm:640px, md:768px, lg:1024px, xl:1280px, 2xl:1536px
 */

export type Breakpoint = 'sm' | 'md' | 'lg' | 'xl' | '2xl';

export interface BreakpointConfig {
    sm: number;  // 640px
    md: number;  // 768px
    lg: number;  // 1024px
    xl: number;  // 1280px
    '2xl': number; // 1536px
}

export const DEFAULT_BREAKPOINTS: BreakpointConfig = {
    sm: 640,
    md: 768,
    lg: 1024,
    xl: 1280,
    '2xl': 1536
};

/**
 * Applies a Tailwind class with a responsive breakpoint prefix
 * @param breakpoint - The breakpoint prefix (sm, md, lg, xl, 2xl)
 * @param className - The Tailwind class name
 * @returns Responsive class (e.g., 'md:flex', 'lg:p-4')
 */
export function withBreakpoint(breakpoint: Breakpoint, className: string): string {
    if (!className) return className;
    return `${breakpoint}:${className}`;
}

/**
 * Determines the appropriate breakpoint based on width value
 * @param width - Width in pixels
 * @param breakpoints - Optional custom breakpoint configuration
 * @returns The matching breakpoint or null if below all breakpoints
 */
export function getBreakpointForWidth(
    width: number,
    breakpoints: BreakpointConfig = DEFAULT_BREAKPOINTS
): Breakpoint | null {
    if (width >= breakpoints['2xl']) return '2xl';
    if (width >= breakpoints.xl) return 'xl';
    if (width >= breakpoints.lg) return 'lg';
    if (width >= breakpoints.md) return 'md';
    if (width >= breakpoints.sm) return 'sm';
    return null;
}

/**
 * Creates responsive utility classes for a given value across breakpoints
 * @param baseClass - Base class name (e.g., 'p-4', 'text-lg')
 * @param breakpointValues - Map of breakpoint to class variation
 * @returns Combined responsive classes
 */
export function createResponsiveClasses(
    baseClass: string,
    breakpointValues: Partial<Record<Breakpoint, string>>
): string {
    const classes: string[] = [baseClass];

    const order: Breakpoint[] = ['sm', 'md', 'lg', 'xl', '2xl'];
    
    for (const bp of order) {
        if (breakpointValues[bp]) {
            classes.push(withBreakpoint(bp, breakpointValues[bp]!));
        }
    }

    return classes.join(' ');
}
