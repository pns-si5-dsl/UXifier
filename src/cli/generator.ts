import fs from 'fs';
import { Context } from '../language-server/generated/ast';
import { extractCharSheet, extractDestinationAndName } from './utils';
import { generateBoilerplate } from './generator/boilerplate.generator';
import { generateApplication } from './generator/app.generator';
import { generateGameContext, generateConfigContext } from './generator/context.generator';
import { generateFields } from './generator/fields.generator';
import { languageMetaData } from '../language-server/generated/module';
import { createUxifierServices } from '../language-server/uxifier-module';

export async function generateProject(filePath: string, destination?: string): Promise<boolean> {
    const services = createUxifierServices();
    const charSheet = await extractCharSheet(filePath, languageMetaData.fileExtensions, services);

    if (charSheet) {
        const data = extractDestinationAndName(filePath, destination);

        if (!fs.existsSync(data.destination)) {
            fs.mkdirSync(data.destination, { recursive: true });
        }

        // Generate the boilerplate.
        const srcPath = generateBoilerplate(charSheet, data.destination);

        // Generate the application.
        generateApplication(charSheet, srcPath);

        // Generate the fields.
        generateFields(charSheet.fields, srcPath);

        const config: Context | undefined = charSheet.configs[0];
        const game: Context | undefined = charSheet.games[0];

        // Generate the configuration.
        if (config && game) {
            generateConfigContext(config, srcPath, '/' + game.name);
        }

        // Generate the game.
        if (game) {
            generateGameContext(game, srcPath);
        }

        // Success.
        return true;
    }

    // Failure.
    return false;
}
