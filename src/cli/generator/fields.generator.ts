import fs from 'fs';
import { CompositeGeneratorNode, NL, processGeneratorNode } from "langium";
import path from 'path';
import { FieldDecl } from "../../language-server/generated/ast";

export function generateFields(fields: FieldDecl[], fileDir: string): void {

    const subDir = path.join(fileDir,'character');
    if (!fs.existsSync(subDir)) {
        fs.mkdirSync(subDir, { recursive: true });
    }

    const node = new CompositeGeneratorNode();
    insertImport(node);


    node.append("export const initialState = {", NL);
    fields.forEach(field => {
        node.append(field.name,': null,', NL);
    })
    node.append(
        "}", NL, NL,
        "export const PersoContext = React.createContext({", NL,
        "state: initialState,", NL,
        "dispatch: () => null", NL,
        "})", NL, NL,
        "export const PersoProvider = ({ children }) => {", NL,
        "const [state, dispatch] = React.useReducer(reducer, initialState)", NL, NL,
        "return (", NL,
        "<PersoContext.Provider value={[ state, dispatch ]}>", NL,
        "{ children }", NL,
        "</PersoContext.Provider>", NL,
        ")", NL,
        "}", NL, NL,
        "export const reducer = (state, action) => {", NL,
        "switch (action.type) {", NL,
        "case 'up':", NL,
        "return {", NL,
        "...state,", NL,
        "...action.value,", NL,
        "};", NL,
        "case 'reset':", NL,
        "let result = {", NL,
        "...state,", NL,
        "};", NL,
        "if (!action.value) {", NL,
        "result = { ...initialState };", NL,
        "} else if (Array.isArray(action.value)){", NL,
        "action.value.forEach((attr) => {", NL,
        "result[attr] = initialState[attr];", NL,
        "})", NL,
        "} else result[action.value] = initialState[action.value];", NL,
        "return result;", NL, NL, 
        "default:", NL,
        "return state", NL,
        "}", NL,
        "}", NL
    );


    fs.writeFileSync(`${path.join(subDir,'index')}.js`, processGeneratorNode(node));
}

function insertImport(node: CompositeGeneratorNode): void {
    node.append(
        "import React from 'react'", NL, NL
    );
}