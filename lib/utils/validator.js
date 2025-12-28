/**
 * @fileoverview Input validation utilities for placehold CLI
 * @description Validates dimensions, hex colors, formats and other user inputs
 */

import path from "path";
import fs from "fs";

/**
 * Validates hexadecimal color format
 * Accepts: #RGB, #RGBA, #RRGGBB, #RRGGBBAA
 * @param {string} color - Color string to validate
 * @returns {boolean} True if valid hex color
 */
export const isValidHexColor = (color) => {
    if (!color || typeof color !== "string") return false;
    const hexRegex = /^#([A-Fa-f0-9]{3}|[A-Fa-f0-9]{4}|[A-Fa-f0-9]{6}|[A-Fa-f0-9]{8})$/;
    return hexRegex.test(color);
};

/**
 * Normalizes hex color to 8-character format (RRGGBBAA)
 * @param {string} color - Hex color to normalize
 * @returns {string} Normalized hex color with alpha
 */
export const normalizeHexColor = (color) => {
    if (!isValidHexColor(color)) return "#000000FF";

    let hex = color.slice(1).toUpperCase();

    switch (hex.length) {
        case 3: // #RGB -> #RRGGBBFF
            hex = hex.split("").map(c => c + c).join("") + "FF";
            break;
        case 4: // #RGBA -> #RRGGBBAA
            hex = hex.split("").map(c => c + c).join("");
            break;
        case 6: // #RRGGBB -> #RRGGBBFF
            hex = hex + "FF";
            break;
        // case 8: already correct format
    }

    return `#${hex}`;
};

/**
 * Validates dimension string format (WIDTHxHEIGHT)
 * @param {string} data - Dimension string to validate
 * @returns {boolean} True if valid dimensions
 */
export const isValidDimensions = (data) => {
    if (!data || typeof data !== "string") return false;

    const regex = /^\d+x\d+$/i;
    if (!regex.test(data)) return false;

    const [width, height] = data.toLowerCase().split("x").map(Number);

    // Validate reasonable dimensions (1px to 10000px)
    return width > 0 && width <= 10000 && height > 0 && height <= 10000;
};

/**
 * Validates output file extension matches format
 * @param {string} filepath - Output file path
 * @param {string} format - Expected format (png, jpg, webp)
 * @returns {boolean} True if valid path
 */
export const isValidOutputPath = (filepath, format = "png") => {
    if (!filepath || typeof filepath !== "string") return false;
    const ext = path.extname(filepath).toLowerCase().slice(1);

    // If no extension, it's valid (we'll add it)
    if (!ext) return true;

    // Check if extension matches expected format
    const validExts = ["png", "jpg", "jpeg", "webp"];
    return validExts.includes(ext);
};

/**
 * Validates image format type
 * @param {string} format - Format to validate
 * @returns {boolean} True if valid format
 */
export const isValidFormat = (format) => {
    const validFormats = ["png", "jpg", "jpeg", "webp"];
    return validFormats.includes(format?.toLowerCase());
};

/**
 * Validates font size option
 * @param {string|number} fontsize - Font size to validate
 * @returns {boolean} True if valid font size
 */
export const isValidFontSize = (fontsize) => {
    if (!fontsize) return true; // Optional

    // "auto" is valid
    if (fontsize === "auto") return true;

    // Numeric value
    const size = Number(fontsize);
    return !isNaN(size) && size > 0 && size <= 200;
};

/**
 * Validates batch count
 * @param {string|number} batch - Batch count to validate
 * @returns {boolean} True if valid batch count
 */
export const isValidBatchCount = (batch) => {
    if (!batch) return true; // Optional

    const count = Number(batch);
    return !isNaN(count) && count > 0 && count <= 1000;
};

/**
 * Validates directory exists or can be created
 * @param {string} dirpath - Directory path to validate
 * @returns {boolean} True if directory exists or was created
 */
export const ensureDirectory = (dirpath) => {
    try {
        if (!fs.existsSync(dirpath)) {
            fs.mkdirSync(dirpath, { recursive: true });
        }
        return true;
    } catch {
        return false;
    }
};

/**
 * Validates all CLI options and returns errors array
 * @param {object} options - CLI options object
 * @param {string} data - Input dimension string
 * @returns {{valid: boolean, errors: string[]}}
 */
export const validateOptions = (options, data) => {
    const errors = [];

    // Dimensions validation (required)
    if (!data) {
        errors.push("Dimensions argument is required (e.g., 800x600)");
    } else if (!isValidDimensions(data)) {
        errors.push(`Invalid dimensions: "${data}". Use WIDTHxHEIGHT format (e.g., 800x600). Max 10000px.`);
    }

    // Color validation
    if (options.color && !isValidHexColor(options.color)) {
        errors.push(`Invalid text color: "${options.color}". Use hex format (#RGB, #RRGGBB, or #RRGGBBAA)`);
    }

    if (options.background && !isValidHexColor(options.background)) {
        errors.push(`Invalid background color: "${options.background}". Use hex format (#RGB, #RRGGBB, or #RRGGBBAA)`);
    }

    // Format validation
    if (options.format && !isValidFormat(options.format)) {
        errors.push(`Invalid format: "${options.format}". Supported formats: png, jpg, webp`);
    }

    // Font size validation
    if (options.fontsize && !isValidFontSize(options.fontsize)) {
        errors.push(`Invalid font size: "${options.fontsize}". Use a number (1-200) or "auto"`);
    }

    // Batch validation
    if (options.batch && !isValidBatchCount(options.batch)) {
        errors.push(`Invalid batch count: "${options.batch}". Must be a number between 1 and 1000`);
    }

    return {
        valid: errors.length === 0,
        errors
    };
};

export default {
    isValidHexColor,
    normalizeHexColor,
    isValidDimensions,
    isValidOutputPath,
    isValidFormat,
    isValidFontSize,
    isValidBatchCount,
    ensureDirectory,
    validateOptions
};