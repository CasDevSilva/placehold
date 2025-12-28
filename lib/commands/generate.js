import sharp from "sharp";
import { getDimensions, isValidOutputPath, ensureDirectory } from "../utils/index.js";
import path from "path";
import os from "os";

const DEFAULT_EXPORT_DIR = path.join(os.homedir(), ".placehold")

export async function handleGenerate(options, data) {
    let mObjOptions = {...getDimensions(data)};
    mObjOptions.channels = 4;
    mObjOptions.background = options.background || "#EAF9D9";

    // Iniciamos la instancia
    let imagePipeline = sharp({ create: mObjOptions });

    // --- TEXTO ---
    if (options.text) {
        imagePipeline = imagePipeline.composite([{
            input: {
                text: {
                    text: `<span foreground="${options.color || '#040F0F'}">${options.text}</span>`,
                    font: `sans ${options.fontsize || 16}`, // Aquí pasas "NombreFuente Tamaño"
                    rgba: true,
                    align: "center",
                    width: mObjOptions.width
                }
            },
            gravity: "center"
        }]);
    }

    // --- BORDER ---
    if (options.border) {
        imagePipeline = imagePipeline.extend({
            top: 10,
            bottom: 10,
            left: 10,
            right: 10,
            background: '#1A181B'
        })
    }

    // --- FORMATO ---
    if (options.format === "jpg") {
        imagePipeline = imagePipeline.jpeg();
    } else if (options.format === "webp") {
        imagePipeline = imagePipeline.webp();
    } else {
        imagePipeline = imagePipeline.png();
    }

    if (!isValidOutputPath(DEFAULT_EXPORT_DIR)) {
        ensureDirectory(DEFAULT_EXPORT_DIR)
    }

    // --- EXPORTAR ---
    if (options.batch) {
        return imagePipeline;
    }

    let outputPath = "";

    if (options.output) {

    } else {
        const filename = `hold-${Date.now()}.${options.format || "png"}`;
        outputPath = path.join(DEFAULT_EXPORT_DIR, filename);
    }

    await imagePipeline.toFile(outputPath);
}

export default {
    handleGenerate
}