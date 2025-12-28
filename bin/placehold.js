#!/usr/bin/env node

/**
 * @fileoverview placehold CLI entry point
 * @description Command line interface for generating placeholder images
 * @author CasDevSilva
 * @version 1.0.0
 */

import { program } from "commander";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { validateOptions, logger } from "../lib/utils/index.js";
import { handleBatchMode, handleGenerate } from "../lib/commands/index.js";

// Get package version
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const pkg = JSON.parse(readFileSync(join(__dirname, "../package.json"), "utf8"));

/**
 * CLI Program Configuration
 */
program
    .name("placehold")
    .description("Generate placeholder images locally with custom dimensions, colors, text and batch processing")
    .version(pkg.version, "-v, --version", "Display version number")
    .argument("[dimensions]", "Image dimensions in WIDTHxHEIGHT format (e.g., 800x600)")

    // Color options
    .option("-b, --background <hex>", "Background color in hex format", "#CCCCCC")
    .option("-c, --color <hex>", "Text color in hex format", "#666666")

    // Output options
    .option("-f, --format <type>", "Output format: png, jpg, webp", "png")
    .option("-o, --output <path>", "Output file path (default: ~/.placehold/)")

    // Text options
    .option("-t, --text <string>", "Custom text to display (default: dimensions)")
    .option("-s, --fontsize <size>", "Font size in pixels or 'auto'", "auto")

    // Styling options
    .option("--border", "Add border to image")

    // Batch processing
    .option("--batch <number>", "Generate multiple images with same dimensions")

    // Action handler
    .action(async (data, options) => {
        try {
            // Validate inputs
            const validation = validateOptions(options, data);

            if (!validation.valid) {
                logger.error("Validation failed:");
                validation.errors.forEach(err => logger.error(`  ${err}`));
                process.exit(1);
            }

            // Batch processing mode
            if (options.batch) {
                await handleBatchMode(options, data);
                return;
            }

            // Single image generation
            await handleGenerate(options, data);

        } catch (error) {
            logger.error(`Error: ${error.message}`);
            process.exit(1);
        }
    });

// Parse CLI arguments
program.parse();

// Show help if no arguments provided
if (process.argv.length === 2) {
    program.help();
}