import fs from 'fs';
import { CompositeGeneratorNode, NL, processGeneratorNode } from "langium";
import path from 'path';
import { Context } from "../../language-server/generated/ast";
import { generatePage } from './page.generator';

export function generateContext(context: Context, fileDir: string): void {

    const node = new CompositeGeneratorNode();
    insertImport(node);


    node.append(
        "export function ", context.name, "(props) {", NL,
        "return (", NL,
        "<Box fill={true}>", NL,
        "<Box", NL,
        "pad='medium'", NL,
        "fill='vertical'", NL,
        "background='light-1'>", NL,
        "<Outlet/>", NL,
        "<Box height='xsmall'/>", NL,
        "</Box>", NL,
        "<Nav", NL,
        "style={{position: 'fixed', bottom: 0, width: '100%'}}", NL,
        "basis='full'", NL,
        "direction='row'", NL,
        "background='brand'", NL,
        "pad='medium'", NL,
        ">", NL,
        "<Link to='/", context.name, "'>", context.name, "</Link>", NL
    );

    context.pages.forEach(page => {
        node.append("<Link to='/", context.name, "/", page.name, "'>", page.name, "</Link>", NL);
    });
    
    node.append(
        "</Nav>", NL,
        "</Box>", NL,
        ");", NL,
        "}", NL,
    );

    for (let i = 0; i < context.pages.length; i++) {
        generatePage(context.pages[i], context.pages[i+1], context.name, node);
    }

    fs.writeFileSync(`${path.join(fileDir,context.name)}.js`, processGeneratorNode(node));
}

function insertImport(node: CompositeGeneratorNode): void {
    node.append(
        "import React from 'react'", NL,
        "import {Box, Card, CardBody, CardFooter, CardHeader, Nav, TextInput, Form, FormField, Button} from 'grommet'", NL,
        "import {PersoContext} from './character'", NL,
        "import {Link, Outlet} from 'react-router-dom'", NL,
        "import { NumberInput } from 'grommet-controls'", NL,
        "import './App.css';", NL, NL
    );
}