/**
 * @fileoverview Single placeholder image generation command
 * @description Handles generation of individual placeholder images with all options
 */

import sharp from "sharp";
import path from "path";
import os from "os";
import { getDimensions, ensureDirectory, logger } from "../utils/index.js";

/**
 * Default export directory for placeholder images
 */
const DEFAULT_EXPORT_DIR = path.join(os.homedir(), ".placehold", "exports");

/**
 * Generates a single placeholder image and saves to file
 * @param {object} options - CLI options
 * @param {string} data - Dimensions string (e.g., "800x600")
 * @param {boolean} returnPipeline - If true, returns pipeline instead of saving (for batch)
 * @returns {Promise<string|sharp.Sharp>} Path to saved file or sharp pipeline
 */
export async function handleGenerate(options, data, returnPipeline = false) {
    const dimensions = getDimensions(data);

    // Build sharp create options
    const createOptions = {
        width: dimensions.width,
        height: dimensions.height,
        channels: 4,
        background: options.background || "#CCCCCC"
    };

    logger.processing(`Generating ${dimensions.width}x${dimensions.height} placeholder...`);

    // Initialize sharp pipeline
    let imagePipeline = sharp({ create: createOptions });

    // --- TEXT OVERLAY ---
    const displayText = options.text || `${dimensions.width} × ${dimensions.height}`;
    const fontSize = calculateFontSize(options.fontsize, dimensions);

    imagePipeline = imagePipeline.composite([{
        input: {
            text: {
                text: `<span foreground="${options.color || '#666666'}">${displayText}</span>`,
                font: `sans ${fontSize}`,
                rgba: true,
                align: "center",
                width: dimensions.width
            }
        },
        gravity: "center"
    }]);

    // --- BORDER ---
    if (options.border) {
        imagePipeline = imagePipeline.extend({
            top: 2,
            bottom: 2,
            left: 2,
            right: 2,
            background: "#333333"
        });
    }

    // --- FORMAT ---
    const format = (options.format || "png").toLowerCase();

    if (format === "jpg" || format === "jpeg") {
        imagePipeline = imagePipeline.jpeg({ quality: 90 });
    } else if (format === "webp") {
        imagePipeline = imagePipeline.webp({ quality: 90 });
    } else {
        imagePipeline = imagePipeline.png();
    }

    // Return pipeline for batch processing
    if (returnPipeline) {
        return imagePipeline;
    }

    // --- RESOLVE OUTPUT PATH ---
    const outputPath = resolveOutputPath(options.output, format, dimensions);
    const outputDir = path.dirname(outputPath);

    // Ensure output directory exists
    if (!ensureDirectory(outputDir)) {
        throw new Error(`Failed to create output directory: ${outputDir}`);
    }

    // --- SAVE FILE ---
    await imagePipeline.toFile(outputPath);

    logger.success("Placeholder image generated successfully");
    logger.saved(outputPath);
    logger.info(`Dimensions: ${dimensions.width}x${dimensions.height} | Format: ${format.toUpperCase()}`);

    return outputPath;
}

/**
 * Resolves output path with defaults
 * @param {string|undefined} output - User specified output
 * @param {string} format - Output format
 * @param {object} dimensions - Image dimensions
 * @returns {string} Resolved absolute output path
 */
function resolveOutputPath(output, format, dimensions) {
    // If user specified output path
    if (output) {
        // Check if it's just a filename or full path
        if (path.isAbsolute(output)) {
            // Absolute path - use as is, add extension if missing
            return ensureExtension(output, format);
        }

        // Relative path or filename
        if (output.includes(path.sep) || output.includes("/")) {
            // Has directory separators - resolve relative to cwd
            return ensureExtension(path.resolve(output), format);
        }

        // Just a filename - put in default directory
        return path.join(DEFAULT_EXPORT_DIR, ensureExtension(output, format));
    }

    // Default: ~/.placehold/exports/hold-{dimensions}-{timestamp}.{format}
    const timestamp = Date.now();
    const filename = `hold-${dimensions.width}x${dimensions.height}-${timestamp}.${format}`;
    return path.join(DEFAULT_EXPORT_DIR, filename);
}

/**
 * Ensures file has correct extension
 * @param {string} filepath - File path
 * @param {string} format - Expected format
 * @returns {string} File path with correct extension
 */
function ensureExtension(filepath, format) {
    const ext = path.extname(filepath).toLowerCase();
    const expectedExt = `.${format}`;

    if (!ext) {
        return `${filepath}${expectedExt}`;
    }

    // If extension doesn't match format, append correct one
    const validExts = [".png", ".jpg", ".jpeg", ".webp"];
    if (!validExts.includes(ext)) {
        return `${filepath}${expectedExt}`;
    }

    return filepath;
}

/**
 * Calculates font size based on option or image dimensions
 * @param {string|number} fontsize - Font size option
 * @param {object} dimensions - Image dimensions
 * @returns {number} Calculated font size
 */
function calculateFontSize(fontsize, dimensions) {
    if (fontsize && fontsize !== "auto") {
        const size = parseInt(fontsize, 10);
        if (!isNaN(size) && size > 0) {
            return size;
        }
    }

    // Auto: calculate based on image size
    // Use smaller dimension to ensure text fits
    const minDimension = Math.min(dimensions.width, dimensions.height);

    // Scale font: roughly 5% of smaller dimension, min 12px, max 72px
    const autoSize = Math.round(minDimension * 0.08);
    return Math.max(12, Math.min(autoSize, 72));
}

export default {
    handleGenerate
};