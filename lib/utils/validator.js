import path from "path"
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

export const isValidDimensions = (data) => {
    const regex = new RegExp("^\\d+x\\d+$")
    let mBoolValid = false;

    if (regex.test(data)) {
        let mArrDimensions = data.split("x");

        if (!mArrDimensions.find(mIntDimension => isNaN(mIntDimension))) {
            mBoolValid = true
        }
    }

    return mBoolValid;
}

/**
 * Validates output file extension matches format
 * @param {string} filepath - Output file path
 * @param {string} format - Expected format (png, svg)
 * @returns {boolean} True if extension matches format
 */
export const isValidOutputPath = (filepath, format = "png") => {
    if (!filepath || typeof filepath !== "string") return false;
    const ext = path.extname(filepath).toLowerCase().slice(1);
    return ext === format.toLowerCase();
};

export const isValidFormat = (format) => {
    const validFormats = ["png", "jpg", "webp"];
    return validFormats.includes(format?.toLowerCase());
};

export const validateOptions = (options, data) => {
    const errors = [];

    if (!data) {
        errors.push("Data argument is required");
    }

    if (data && !isValidDimensions(data)) {
        errors.push("Invalid data argument.");
    }

    // Color validation
    if (options.color && !isValidHexColor(options.color)) {
        errors.push(`Invalid color format: "${options.color}". Use hex format (#RGB, #RRGGBB, or #RRGGBBAA)`);
    }

    if (options.background && !isValidHexColor(options.background)) {
        errors.push(`Invalid background format: "${options.background}". Use hex format (#RGB, #RRGGBB, or #RRGGBBAA)`);
    }

    // Format validation
    if (options.format && !isValidFormat(options.format)) {
        errors.push(`Invalid format: "${options.format}". Supported formats: png, jpg, webp`);
    }

    // Batch validation
    if (options.batch && isNaN(options.batch)) {
        errors.push("Error, specify a number");
    }

    // Font size validation
    if (options.fontsize &&
        !isNaN(options.fontsize) &&
        options.fontsize < 0) {
        errors.push("If set a number size, greater to 0.");
    }

    if (options.fontsize &&
        isNaN(options.fontsize) &&
        options.fontsize != "auto") {
        errors.push("It set a text size, only specify auto");
    }

    return {
        valid: errors.length === 0,
        errors
    };
}

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

export default {
    isValidHexColor,
    normalizeHexColor,
    isValidDimensions,
    isValidOutputPath,
    isValidFormat,
    validateOptions,
    ensureDirectory
};