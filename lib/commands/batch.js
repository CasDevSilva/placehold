/**
 * @fileoverview Batch placeholder image generation command
 * @description Processes multiple placeholder images with same dimensions
 */

import path from "path";
import os from "os";
import { handleGenerate } from "./generate.js";
import { ensureDirectory, logger } from "../utils/index.js";

/**
 * Default export directory for batch placeholder images
 */
const DEFAULT_EXPORT_DIR = path.join(os.homedir(), ".placehold", "exports");

/**
 * Processes batch generation of placeholder images
 * @param {object} options - CLI options
 * @param {string} data - Dimensions string (e.g., "800x600")
 * @returns {Promise<{success: number, failed: number, outputDir: string}>}
 */
export async function processBatch(options, data) {
    const count = parseInt(options.batch, 10);
    const format = (options.format || "png").toLowerCase();

    // Create batch output directory
    const timestamp = Date.now();
    const outputDir = options.output
        ? path.resolve(options.output)
        : path.join(DEFAULT_EXPORT_DIR, `batch-${data}-${timestamp}`);

    // Ensure output directory exists
    if (!ensureDirectory(outputDir)) {
        throw new Error(`Failed to create output directory: ${outputDir}`);
    }

    logger.header(`Batch Processing: ${count} placeholder images`);
    logger.info(`Dimensions: ${data}`);
    logger.info(`Output directory: ${outputDir}`);
    logger.info(`Format: ${format.toUpperCase()}`);
    logger.divider();

    let success = 0;
    let failed = 0;

    for (let i = 0; i < count; i++) {
        try {
            // Show progress
            logger.progress(i + 1, count, `Generating image ${i + 1}/${count}`);

            // Get pipeline from generate (without saving)
            const imagePipeline = await handleGenerate(options, data, true);

            // Create filename and save
            const filename = `hold-${String(i + 1).padStart(3, "0")}.${format}`;
            const outputPath = path.join(outputDir, filename);

            await imagePipeline.toFile(outputPath);

            success++;
        } catch (err) {
            logger.error(`Failed to generate image ${i + 1}: ${err.message}`);
            failed++;
        }
    }

    // Summary
    logger.divider();
    logger.header("Batch Processing Complete");
    logger.success(`Generated: ${success} images`);

    if (failed > 0) {
        logger.error(`Failed: ${failed} images`);
    }

    logger.saved(outputDir);

    return { success, failed, outputDir };
}

/**
 * Handles batch processing mode (entry point from CLI)
 * @param {object} options - CLI options
 * @param {string} data - Dimensions string
 */
export async function handleBatchMode(options, data) {
    const result = await processBatch(options, data);

    if (result.failed > 0) {
        process.exit(1);
    }
}

export default {
    processBatch,
    handleBatchMode
};