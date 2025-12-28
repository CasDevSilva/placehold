import { handleGenerate } from "./index.js";
import { isValidOutputPath, logger, ensureDirectory } from "../utils/index.js";
import path from "path";
import os from "os";

const DEFAULT_EXPORT_DIR = path.join(os.homedir(), ".placehold", "exports", `${Date.now()}`);

export async function processBatch(options, data) {
    let success = 0;
    let failed = 0;

    for (let i = 0; i < options.batch; i++) {
        try {
            logger.progress(i + 1, options.batch, truncateData(`${data} - ${i}`));

            let imagePipeline = await handleGenerate(options, data);

            if (!isValidOutputPath(DEFAULT_EXPORT_DIR)) {
                ensureDirectory(DEFAULT_EXPORT_DIR);
            }

            const filename = `hold-${String(i + 1).padStart(3, "0")}.${options.format}`;
            const outputPath = path.join(DEFAULT_EXPORT_DIR, filename);

            await imagePipeline.toFile(outputPath);

            success++;
        } catch(err) {
            logger.error(`Failed to generate placehold - ${err.message}`);
            failed++;
        }
    }
}

export async function handleBatchMode (options, data) {
    logger.header("Batch Mode");
    const result = await processBatch(options, data);

    if (result.failed > 0) {
        process.exit(1);
    }
}

/**
 * Truncates data string for display
 * @param {string} data - Data to truncate
 * @param {number} maxLength - Maximum length
 * @returns {string} Truncated string
 */
const truncateData = (data, maxLength = 40) => {
    if (data.length <= maxLength) return data;
    return data.substring(0, maxLength - 3) + "...";
};

export default {
    processBatch,
    handleBatchMode,
    truncateData
}