import fs from 'fs';
import { Application, Context, /* ButtonComponent, Context, DecoField, FieldDecl, FieldsComponent, ImageComponent, isButtonComponent, isFieldsComponent, isImageComponent, isTextComponent, PageDecl, TextComponent */ } from '../language-server/generated/ast';
import { extractDestinationAndName } from './cli-util';
import { generateBoilerplate } from './generator/boilerplate.generator';
import { generateApplication } from './generator/app.generator';
import { generateContext } from './generator/context.generator';
import { generateFields } from './generator/fields.generator';

export function generateProject(application: Application, filePath: string, destination: string | undefined): void {
    const data = extractDestinationAndName(filePath, destination);

    if (!fs.existsSync(data.destination)) {
        fs.mkdirSync(data.destination, { recursive: true });
    }

    // Generate the boilerplate.
    const srcPath = generateBoilerplate(application, data.destination);

    // Generate the application.
    generateApplication(application, srcPath);

    // Generate the fields.
    generateFields(application.fields, srcPath);

    const config: Context | undefined = application.configs[0];
    const game: Context | undefined = application.games[0];
    
    // Generate the configuration.
    if (config) {
        generateContext(config, srcPath);
    }
    
    // Generate the game.
    if (game) {
        generateContext(game, srcPath);
    }
}

export function camelize(str: string): string {
    if (str.length === 0) throw new Error("Could not camelize empty string");
    if (str.length < 2) return str.toUpperCase();
    return str.charAt(0).toUpperCase() + str.substring(1);
}