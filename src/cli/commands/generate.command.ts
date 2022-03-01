import colors from 'colors';
import { generateProject } from '../generators/project.generator';
import { GenerateOptions } from './options/generate.options';

/**
 * Generates the web application of an RPG character sheet from a project file.
 * @param filePath The project file to be compiled.
 * @param options The compilation options.
 */
export async function generateCommand(filePath: string, options: GenerateOptions): Promise<void> {
    if (await generateProject(filePath, options.destination, options.force)) {
        console.log(colors.green('Project successfully generated!'));
    }
}
