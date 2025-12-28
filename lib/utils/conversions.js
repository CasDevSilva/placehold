/**
 * @fileoverview Dimension conversion utilities for placehold CLI
 * @description Parses and converts dimension strings
 */

/**
 * Parses dimension string into width and height
 * @param {string} data - Dimension string in WIDTHxHEIGHT format
 * @returns {{width: number, height: number}} Parsed dimensions object
 * @example
 * getDimensions("800x600") // { width: 800, height: 600 }
 */
export const getDimensions = (data) => {
    const parts = data.toLowerCase().split("x");

    return {
        width: parseInt(parts[0], 10),
        height: parseInt(parts[1], 10)
    };
};

/**
 * Formats dimensions object back to string
 * @param {object} dimensions - Dimensions object
 * @param {number} dimensions.width - Image width
 * @param {number} dimensions.height - Image height
 * @returns {string} Formatted dimension string
 * @example
 * formatDimensions({ width: 800, height: 600 }) // "800x600"
 */
export const formatDimensions = (dimensions) => {
    return `${dimensions.width}x${dimensions.height}`;
};

/**
 * Calculates aspect ratio
 * @param {number} width - Image width
 * @param {number} height - Image height
 * @returns {number} Aspect ratio (width/height)
 */
export const getAspectRatio = (width, height) => {
    return width / height;
};

export default {
    getDimensions,
    formatDimensions,
    getAspectRatio
};