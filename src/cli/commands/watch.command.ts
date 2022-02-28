import fs from 'fs';
import { languageMetaData } from '../../language-server/generated/module';
import { generate } from './generate.command';
import { WatchOptions } from './options/watch.options';

/**
 * Checks if a file is a project file.
 * @param fileName The file to be checked.
 * @returns true if the file is a project file; false otherwise.
 */
function isProjectFile(fileName: string): boolean {
    // Check the extension.
    return languageMetaData.fileExtensions.some(extension => fileName.endsWith(extension));
}

/**
 * Watches project files to generate the web application of an RPG character sheet on every modification.
 */
export function watch(options: WatchOptions): void {
    console.log('Watching for file changes.');

    let wait = false;
    fs.watch(
        process.cwd(),
        (event, fileName) => {
            if (fileName && isProjectFile(fileName)) {
                if (!wait) {
                    console.log('File change detected.');
                    generate(fileName, { destination: options.destination });

                    wait = true;
                    setTimeout(() => wait = false, 100);
                }
            }
        }
    );
};