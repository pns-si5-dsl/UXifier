import fs from 'fs';
import colors from 'colors';
import { generateProject } from '../generators/project.generator';
import { WatchOptions } from './options/watch.options';

/**
 * Watches a project file to generate the web application of an RPG character sheet on every modification.
 * @param filePath The project file to be compiled.
 * @param options The compilation options.
 */
export async function watchCommand(filePath: string, options: WatchOptions): Promise<void> {
    // Compile the project file.
    if (await generateProject(filePath, options.destination, options.force)) {
        console.log(colors.green('Project successfully generated!'));
    }

    // Watch the project file.
    console.log('Watching for file changes.');
    let wait = false;
    fs.watchFile(
        filePath,
        async () => {
            if (!wait) {
                console.log(colors.bgWhite(colors.black('File change detected.')));
                if (await generateProject(filePath, options.destination, options.force)) {
                    console.log(colors.green('Project successfully generated!'));
                }

                // Add a cool down.
                wait = true;
                setTimeout(() => wait = false, 100);
            }
        }
    );
};
