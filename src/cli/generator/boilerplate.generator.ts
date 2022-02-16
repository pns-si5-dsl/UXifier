import fs from 'fs';
import fse from 'fs-extra';
import path from "path";
import { Application } from '../../language-server/generated/ast';

export function generateBoilerplate(application: Application, destinationPath: string): string {
    const resourcePath = path.join(__dirname, "..", "..", "..", "resources");

    // Package.json.
    const packageFilePath = path.join(resourcePath, 'package.json')
    const packageFileBuffer = fs.readFileSync(packageFilePath);
    let packageFileContent = packageFileBuffer.toString();
    packageFileContent = packageFileContent.replace('${name}', application.name);
    fs.writeFileSync(path.join(destinationPath, 'package.json'), packageFileContent);

    // Public.
    fse.copySync(path.resolve(resourcePath, 'public'), path.resolve(destinationPath, 'public'));
    return '';
}