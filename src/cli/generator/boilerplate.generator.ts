import fs from 'fs';
import fse from 'fs-extra';
import path from "path";
import { Application } from '../../language-server/generated/ast';

export function generateBoilerplate(application: Application, destinationPath: string): string {
    const resourcePath = path.join(__dirname, "..", "..", "..", "resources");

    // Package.json.
    writeFile(resourcePath, destinationPath, 'package.json', application.name);

    // Public.
    fse.copySync(path.resolve(resourcePath, 'public'), path.resolve(destinationPath, 'public'));

    destinationPath = path.join(destinationPath, 'src');
    if (!fs.existsSync(destinationPath)) {
        fs.mkdirSync(destinationPath, { recursive: true });
    }

    // App.css.
    writeFile(resourcePath, destinationPath, 'App.css', application.name);

    // index.js.
    writeFile(resourcePath, destinationPath, 'index.js', application.name);

    // index.css.
    writeFile(resourcePath, destinationPath, 'index.css', application.name);
    
    
    return destinationPath;
}

function writeFile(dirPath: string, destination: string, fileName: string, appName: string): void {
    fs.writeFileSync(
        path.join(destination, fileName),
        replaceInFile('${name}', appName, dirPath, fileName)
    );
}

function replaceInFile(from: string, to: string, resourcePath: string, fileName: string): string {
    const filePath = path.join(resourcePath, fileName)
    const fileBuffer = fs.readFileSync(filePath);
    let fileContent = fileBuffer.toString();
    return fileContent.replaceAll(from, to);
}