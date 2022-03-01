import fs from 'fs';
import path from "path";
import { CharSheet } from '../../language-server/generated/ast';
import colors from 'colors';

/**
 * Generates the boilerplate of a project.
 * @param charSheet The character sheet model.
 * @param destinationPath The destination path.
 * @param force Whether to force the replacement of boilerplate files.
 */
export function generateBoilerplate(charSheet: CharSheet, destinationPath: string, force?: boolean): string {
    const sourcePath = path.join(__dirname, '..', '..', '..', 'resources');

    // Package information.
    copyFile(sourcePath, destinationPath, 'package.json', charSheet, force);

    // Source files.
    const sourceDestinationPath = path.join(destinationPath, 'src');
    if (!fs.existsSync(sourceDestinationPath)) {
        fs.mkdirSync(sourceDestinationPath, { recursive: true });
    }
    copyFile(sourcePath, sourceDestinationPath, 'CharSheet.css', charSheet, force);
    copyFile(sourcePath, sourceDestinationPath, 'index.js', charSheet, force);
    copyFile(sourcePath, sourceDestinationPath, 'index.css', charSheet, force);

    // Public resources.
    const publicSourcePath = path.join(sourcePath, 'public');
    const publicDestinationPath = path.join(destinationPath, 'public');
    if (!fs.existsSync(publicDestinationPath)) {
        fs.mkdirSync(publicDestinationPath, { recursive: true });
    }
    copyFile(publicSourcePath, publicDestinationPath, 'favicon.ico', charSheet, force);
    copyFile(publicSourcePath, publicDestinationPath, 'index.html', charSheet, force);
    copyFile(publicSourcePath, publicDestinationPath, 'logo192.png', charSheet, force);
    copyFile(publicSourcePath, publicDestinationPath, 'logo512.png', charSheet, force);
    copyFile(publicSourcePath, publicDestinationPath, 'manifest.json', charSheet, force);

    return destinationPath;
}

/**
 * Copies a file and replaces special strings.
 * @param sourcePath The path to the source directory.
 * @param destinationPath The path to the destination directory.
 * @param fileName The name of the file to copy.
 * @param force Whether to force the replacement of boilerplate files.
 * @param charSheet The character sheet model.
 */
function copyFile(sourcePath: string, destinationPath: string, fileName: string, charSheet: CharSheet, force?: boolean): void {
    const sourceFile = path.join(sourcePath, fileName);
    const destinationFile = path.join(destinationPath, fileName);

    // Write the file.
    if (!fs.existsSync(destinationFile) || force) {
        fs.writeFileSync(
            destinationFile,

            // Replace the application name.
            replaceInFile('${name}', charSheet.name, sourceFile)
        );
    } else {
        console.log(colors.yellow(`Ignored: The '${destinationFile}' file already exists.`));
    }
}

/**
 * Replaces a string in a file.
 * @param target The string to be replaced
 * @param replacement The string to be substituted.
 * @param filePath The path to the file.
 */
function replaceInFile(target: string, replacement: string, filePath: string): string {
    const fileBuffer = fs.readFileSync(filePath);
    const fileContent = fileBuffer.toString();
    return fileContent.replaceAll(target, replacement);
}
