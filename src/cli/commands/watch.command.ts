import fs from 'fs';
import colors from 'colors';
import { languageMetaData } from '../../language-server/generated/module';
import { generateProject } from '../generator';
import { WatchOptions } from './options/watch.options';

/**
 * Checks if a file is a project file.
 * @param filePath The file to be checked.
 * @returns true if the file is a project file; false otherwise.
 */
function isProjectFile(filePath: string): boolean {
    // Check the extension.
    return languageMetaData.fileExtensions.some(extension => filePath.endsWith(extension));
}

/**
 * Watches project files to generate the web application of an RPG character sheet on every modification.
 */
export function watchCommand(options: WatchOptions): void {
    console.log('Watching for file changes.');

    let wait = false;
    fs.watch(
        process.cwd(),
        async (event, filePath) => {
            if (filePath && isProjectFile(filePath)) {
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
        }
    );
};
