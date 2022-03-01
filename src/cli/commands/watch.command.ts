import fs from 'fs';
import colors from 'colors';
import { generateProject } from '../generator';
import { WatchOptions } from './options/watch.options';

/**
 * Watches a project file to generate the web application of an RPG character sheet on every modification.
 * @param filePath The project file to be compiled.
 * @param options The compilation options.
 */
export function watchCommand(filePath: string, options: WatchOptions): void {
    console.log('Watching for file changes.');

    let wait = false;
    fs.watchFile(
        filePath,
        async () => {
            if (!wait) {
                console.log(colors.bgWhite(colors.black('File change detected.')));
                if (await generateProject(filePath, options.destination)) {
                    console.log(colors.green('Project successfully generated!'));
                }

                // Add a cool down.
                wait = true;
                setTimeout(() => wait = false, 100);
            }
        }
    );
};
