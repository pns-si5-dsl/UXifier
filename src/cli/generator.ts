import fs from 'fs';
import { CompositeGeneratorNode, NL, processGeneratorNode } from 'langium';
import { Application, /* ButtonComponent, Context, DecoField, FieldDecl, FieldsComponent, ImageComponent, isButtonComponent, isFieldsComponent, isImageComponent, isTextComponent, PageDecl, TextComponent */ } from '../language-server/generated/ast';
import { extractDestinationAndName } from './cli-util';
import path from 'path';
import { generateApplication } from './generator/app.generator';

export function generateJavaScript(application: Application, filePath: string, destination: string | undefined): string {
    const data = extractDestinationAndName(filePath, destination);
    const generatedFilePath = `${path.join(data.destination, data.name)}.js`;

    const fileNode = new CompositeGeneratorNode();
    insertImport(fileNode);
    generateApplication(application, fileNode)

    if (!fs.existsSync(data.destination)) {
        fs.mkdirSync(data.destination, { recursive: true });
    }
    fs.writeFileSync(generatedFilePath, processGeneratorNode(fileNode));
    return generatedFilePath;
}

function insertImport(node: CompositeGeneratorNode): void {
    node.append(
        "import './App.css';", NL,
        "import {Box, Button, Grommet, Heading} from 'grommet';",NL,
        "import {Notification} from 'grommet-icons';",NL,
        "import {useState} from 'react';", NL,
        "import {Routes, Route, BrowserRouter, Link} from 'react-router-dom';",NL,NL
        );
}