import { Command } from 'commander';
import { languageMetaData } from '../language-server/generated/module';
import { generateCommand } from './commands/generate.command';
import { watchCommand } from './commands/watch.command';

export default function(): void {
    const program = new Command();

    program
        .name('uxifier')
        .description('generates web applications of RPG character sheets')
        .version('0.0.1');

    program
        .command('generate')
        .argument('<file>', `file to be compiled (allowed extensions: ${languageMetaData.fileExtensions.join(', ')})`)
        .option('-d, --destination <dir>', 'destination folder of the generated web application')
        .description('generates the web application of an RPG character sheet from a project file')
        .action(generateCommand);

    program
        .command('watch')
        .option('-d, --destination <dir>', 'destination folder of the generated web application')
        .description('watches project files to generate the web application of an RPG character sheet on every modification')
        .action(watchCommand);

    program.parse(process.argv);
}
