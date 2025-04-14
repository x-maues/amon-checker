// colors.js - Utility for colored console output

// ANSI color codes for subtle coloring
const colors = {
    reset: "\x1b[0m",
    // Subtle variants
    red: "\x1b[31m",
    yellow: "\x1b[33m",
    blue: "\x1b[34m",
    cyan: "\x1b[36m",
    gray: "\x1b[90m"
};

// Wrapper functions for colored output
export const colorize = {
    error: (text) => `${colors.red}${text}${colors.reset}`,
    y: (text) => `${colors.yellow}${text}${colors.reset}`,
    info: (text) => `${colors.blue}${text}${colors.reset}`,
    success: (text) => `${colors.cyan}${text}${colors.reset}`,
    dim: (text) => `${colors.gray}${text}${colors.reset}`
};