import colors from 'colors';
import { Command } from 'commander';
import { languageMetaData } from '../language-server/generated/module';
import { Application } from '../language-server/generated/ast';
import { createUxifierServices } from '../language-server/uxifier-module';
import { extractAstNode } from './cli-util';
import { generateProject } from './generator';
// import { window, workspace } from 'vscode';

export const generateAction = async (fileName: string, opts: GenerateOptions): Promise<void> => {
    const model = await extractAstNode<Application>(fileName, languageMetaData.fileExtensions, createUxifierServices());
    const generatedFilePath = generateProject(model, fileName, opts.destination);
    console.log(colors.green(`JavaScript code generated successfully: ${generatedFilePath}`));
};

export const watchAction = async (): Promise<void> => {
    // const languageExt = require('../../package.json').contributes.languages[0].extensions[0];
    // const watcher = workspace.createFileSystemWatcher('**/*' + languageExt);
    // watcher.onDidChange(() => {
    //      window.showInformationMessage('Your web app was updated!');
    // });
};

export type GenerateOptions = {
    destination?: string;
}

export default function(): void {
    const program = new Command();

    program
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        .version(require('../../package.json').version);

    program
        .command('generate')
        .argument('<file>', `possible file extensions: ${languageMetaData.fileExtensions.join(', ')}`)
        .option('-d, --destination <dir>', 'destination directory of generating')
        .description('generates a web app of an RPG character sheet')
        .action(generateAction);

    program
        .command('watch')
        .description('watches for project files save and generate the web app')
        .action(watchAction);

    program.parse(process.argv);
}
