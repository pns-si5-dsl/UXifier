import fs from 'fs';
import { CompositeGeneratorNode, NL, processGeneratorNode } from "langium";
import path from 'path';
import { Context } from "../../language-server/generated/ast";
import { generateConfigPage } from './config-page.generator';

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
        generateConfigPage(context.pages[i], context.pages[i+1], context.name, node);
    }

    fs.writeFileSync(`${path.join(fileDir,context.name)}.js`, processGeneratorNode(node));
}

function insertImport(node: CompositeGeneratorNode): void {
    node.append(
        "import React, {useContext} from 'react';", NL,
        "import {", NL,
            "Box, Card, Grid, ResponsiveContext, Text, List, Button,", NL,
            "Nav, Stack, Form, FormField, Image, Layer,", NL,
            "Heading, Tabs, Tab, Meter, CardHeader, CardBody, CardFooter, TextInput, CheckBox,", NL,
        "} from 'grommet';", NL,
        "import {Link, Outlet} from \"react-router-dom\";", NL,
        "import {PersoContext} from \"./character\";", NL,
        "import * as Icons from \"grommet-icons\";", NL,
        "import {NumberInput} from 'grommet-controls';", NL, NL
    );
}