import fs from 'fs';
import { CompositeGeneratorNode, NL, processGeneratorNode } from 'langium';
import { Application, ButtonComponent, Context, DecoField, FieldDecl, FieldsComponent, ImageComponent, isButtonComponent, isFieldsComponent, isImageComponent, isTextComponent, PageDecl, TextComponent } from '../language-server/generated/ast';
import { extractDestinationAndName } from './cli-util';
import path from 'path';

export function generateJavaScript(application: Application, filePath: string, destination: string | undefined): string {
    const data = extractDestinationAndName(filePath, destination);
    const generatedFilePath = `${path.join(data.destination, data.name)}.js`;

    const fileNode = new CompositeGeneratorNode();
    generateApplication(application, fileNode)

    if (!fs.existsSync(data.destination)) {
        fs.mkdirSync(data.destination, { recursive: true });
    }
    fs.writeFileSync(generatedFilePath, processGeneratorNode(fileNode));
    return generatedFilePath;
}

function generateApplication(application: Application, node: CompositeGeneratorNode): void {
    node.append('export class ', application.name, ' {', NL, NL);
    node.indent(classNode => {
        classNode.append('constructor() {', NL);
        classNode.indent(fieldNode => {
            application.fields.forEach(f => generateField(f, fieldNode))
        });
        classNode.append('}', NL, NL);
        generateContext(application.config, classNode);
        generateContext(application.game, classNode);
    });
    node.append('}')
}

function generateField(field: FieldDecl, node: CompositeGeneratorNode): void {
    node.append('this.', field.name, ';', NL)
}

function generateContext(context: Context, node: CompositeGeneratorNode): void {
    node.append(context.name, '() {', NL);
    node.indent(body => {
        body.append('const path = "', context.path, '";', NL);
        if (context.navigation) {
            body.append('const navigation = ', context.navigation.type, ';', NL);
        }
        body.append(NL);
        context.pages.forEach(p => generatePage(p, body));
    });
    node.append('}', NL, NL);
}

function generatePage(page: PageDecl, node: CompositeGeneratorNode): void {
    node.append('function ', page.name, '() {', NL);
    node.indent(body => {
        body.append('const path = "', page.path, '";', NL);
        body.append('const is_skipable = ', (page.skipable?true:false).toString(), ';', NL);
        if (page.axe) {
            body.append('const axe = ', page.axe.type, ';', NL);
        }
        body.append(NL);
        page.components.forEach(c => {
            if (isTextComponent(c)) {
                generateTextComponent(c, body);
            } else if (isButtonComponent(c)) {
                generateButtonComponent(c, body);
            } else if (isImageComponent(c)) {
                generateImageComponent(c, body);
            } else if (isFieldsComponent(c)) {
                generateFieldComponent(c, body);
            }
        })
    });
    node.append('}', NL, NL);
}

function generateTextComponent(component: TextComponent, node: CompositeGeneratorNode): void {
    node.append('const text = { text: "', component.value, '"');
    if (component.color) node.append(', color: "', component.color.value, '"');
    node.append(' };', NL);
}

function generateImageComponent(component: ImageComponent, node: CompositeGeneratorNode): void {
    node.append('const image = { source: "', component.source, '" };', NL);
}

function generateButtonComponent(component: ButtonComponent, node: CompositeGeneratorNode): void {
    node.append('const button = { ');
    if (component.color) node.append('href: "', component.href, '"');
    if (component.color) node.append('color: "', component.color.value, '"');
    node.append(' };', NL);
}

function generateFieldComponent(component: FieldsComponent, node: CompositeGeneratorNode): void {
    node.append('const fields = [', NL);
    node.indent(fields => {
        component.decoFields.forEach(deco => generateDecoField(deco, fields))
    })
    node.append('];', NL);
}

function generateDecoField(decoField: DecoField, node: CompositeGeneratorNode): void {
    if (decoField.field.ref) {
        node.append('{ field: ', decoField.field.ref.name, ' },', NL);
    }
}