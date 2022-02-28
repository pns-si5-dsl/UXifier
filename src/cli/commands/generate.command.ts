import colors from 'colors';
import { CharSheet } from '../../language-server/generated/ast';
import { languageMetaData } from '../../language-server/generated/module';
import { createUxifierServices } from '../../language-server/uxifier-module';
import { extractAstNode } from '../cli-util';
import { generateProject } from '../generator';
import { GenerateOptions } from './options/generate.options';

/**
 * Generates the web application of an RPG character sheet from a project file.
 * @param fileName The project file to be compiled.
 * @param options The compilation options. 
 */
export async function generate(fileName: string, options: GenerateOptions): Promise<void> {
    const model = await extractAstNode<CharSheet>(fileName, languageMetaData.fileExtensions, createUxifierServices());
    generateProject(model, fileName, options.destination);
    console.log(colors.green(`Project successfully generated!`));
};