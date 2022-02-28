import fs from 'fs';
import colors from 'colors';
import { LangiumDocument, LangiumServices } from 'langium';
import path from 'path';
import { URI } from 'vscode-uri';
import { CharSheet } from '../language-server/generated/ast';

export async function extractDocument(fileName: string, extensions: string[], services: LangiumServices): Promise<LangiumDocument | undefined> {
    if (!extensions.includes(path.extname(fileName))) {
        console.error(colors.yellow(`Please, choose a file with one of these extensions: ${extensions}.`));
        return;
    }

    if (!fs.existsSync(fileName)) {
        console.error(colors.red(`File ${fileName} doesn't exist.`));
        return;
    }

    const document = services.documents.LangiumDocuments.getOrCreateDocument(URI.file(path.resolve(fileName)));
    const buildResult = await services.documents.DocumentBuilder.build(document);

    const validationErrors = buildResult.diagnostics.filter(e => e.severity === 1);
    if (validationErrors.length > 0) {
        if (validationErrors.length === 1) {
            console.error(colors.red(`${validationErrors.length} error has been detected:`));
        } else {
            console.error(colors.red(`${validationErrors.length} errors have been detected:`));
        }

        for (const validationError of validationErrors) {
            console.error(colors.red(
                `line ${validationError.range.start.line}: ${validationError.message} [${document.textDocument.getText(validationError.range)}]`
            ));
        }
        return;
    }

    return document;
}

export async function extractCharSheet(fileName: string, extensions: string[], services: LangiumServices): Promise<CharSheet | undefined> {
    return (await extractDocument(fileName, extensions, services))?.parseResult?.value as CharSheet;
}

interface FilePathData {
    destination: string,
    name: string
}

export function extractDestinationAndName(filePath: string, destination: string | undefined): FilePathData {
    filePath = filePath.replace(/\..*$/, '').replace(/[.-]/g, '');
    return {
        destination: destination ?? path.join(path.dirname(filePath), 'generated'),
        name: path.basename(filePath)
    };
}
