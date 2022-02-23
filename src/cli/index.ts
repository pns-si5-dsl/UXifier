import colors from 'colors';
import { Command } from 'commander';
import { languageMetaData } from '../language-server/generated/module';
import { Application } from '../language-server/generated/ast';
import { createUxifierServices } from '../language-server/uxifier-module';
import { extractAstNode } from './cli-util';
import { generateProject } from './generator';
import fs from 'fs';

export const generateAction = async (fileName: string, opts: GenerateOptions): Promise<void> => {
    const model = await extractAstNode<Application>(fileName, languageMetaData.fileExtensions, createUxifierServices());
    generateProject(model, fileName, opts.destination);
    console.log(colors.green(`Project generated successfully`));
};

export const watchAction = async (): Promise<void> => {
    let fsWait = false;
    fs.watch(
        process.cwd(),
        (event, filename) => {
            if (filename) {
                if (fsWait) return;
                setTimeout(() => {
                    fsWait = false;
                }, 100);
                console.log(colors.bgWhite(colors.black(event+' detected: '+filename)))
                fsWait = true;
            }
        }
    );
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
