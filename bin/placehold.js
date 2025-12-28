#!/usr/bin/env node
import { program } from "commander";
import { validateOptions, logger } from "../lib/utils/index.js";
import { handleBatchMode, handleGenerate } from "../lib/commands/index.js";

program.name("placehold")
    .argument("[data]")
    .option("-b, --background <string>", "") //done
    .option("-c, --color <string>", "") //done
    .option("-f, --format <string>", "", "png") //done
    .option("--batch <number>", "")
    .option("-s, --fontsize <type>", "") //done
    .option("-t, --text <string>", "") //done
    .option("-o, --output <string>", "")
    .option("--border", "") //done
    .action(async (data, options) => {
        try {
            const validation = validateOptions(options, data);

            if (!validation.valid) {
                logger.error("Validation failed:");
                validation.errors.forEach(err => logger.error(`  ${err}`));
                process.exit(1);
            }

            if (options.batch) {
                await handleBatchMode(options, data);
                return
            }

            await handleGenerate(options, data);
        } catch(error){
            logger.error(`Error: ${error.message}`);
            process.exit(1);
        }
    })

program.parse(process.argv);