const BREAKPOINTS = {
    sm: '(max-width: 480px)',
    md: '(max-width: 786px)',
    lg: '(max-width: 1024px)'
} as const;

type BreakpointsKey = keyof typeof BREAKPOINTS;

export {
    BREAKPOINTS,
    type BreakpointsKey
}