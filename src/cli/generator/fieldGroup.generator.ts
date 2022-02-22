import { CompositeGeneratorNode, NL } from "langium";
import { FieldGroupComponent, DecoField } from "../../language-server/generated/ast";

export function generateFieldGroup(fieldGroup: FieldGroupComponent, node: CompositeGeneratorNode): void {

    node.append(
        "<Card margin='small' background='light-2'>", NL
    );
    if(fieldGroup.titles[0]) {
        node.append(
            "<CardHeader pad='small' background='light-3'>", NL,
            fieldGroup.titles[0].value, NL,
            "</CardHeader>", NL,
        ); 
    }
    node.append(
        "<CardBody margin='small'>", NL
    );

    fieldGroup.decoFields.forEach(decoField => {
        const field = decoField.field.ref;
        if (field)  generateField(decoField, node);
    });

    node.append(
        "</CardBody>", NL,
        "<CardFooter>", NL,
        "</CardFooter>", NL,
        "</Card>", NL
    );

}

function generateField(decoField: DecoField, node: CompositeGeneratorNode ){
    const fieldName =  String(decoField.field.ref?.name);
    const fieldType =  String(decoField.field.ref?.type);
    if(isInput(decoField)){
        node.append(
            "<FormField htmlFor='",fieldName,"-input' label='",fieldName,"' margin={{horizontal: 'medium'}}>", NL
        );
        switch(fieldType){
            case 'string':
                node.append(
                    "<TextInput id='",fieldName,"-input' name='", fieldName, "' placeholder='", fieldName, "'",NL,
                    "value={state.",fieldName,"}", NL,
                    "onChange={e => {", NL,
                    "dispatch({type: 'up', value: {",fieldName,": e.target.value}})", NL,
                    "}}", NL,
                    "/>", NL
                )
                break;
            case 'number':
                //TODO
                break;
            case 'bool':
                //TODO
                break;
            default:
                throw new Error(fieldType+" input type not implemented");
        }
        node.append(
            "</FormField>"
            )
    } else if(isOutput(decoField)){
        // TODO for bool
        node.append(
            "<Card>", NL,
        )
        node.append(
            "<CardHeader pad='small' background='light-3'>", NL,
            String(decoField.field.ref?.name), NL,
            "</CardHeader>", NL,
        );  
        node.append(
            "<CardBody>", NL,
            "{state.", String(fieldName), "}", NL,
            "</CardBody>", NL,
            "</Card>", NL            
        )
    }
}

function isInput(decoField: DecoField): boolean {
    //TODO
    throw new Error("Not implemented");
    
}

function isOutput(decoField: DecoField): boolean {
    //TODO
    throw new Error("Not implemented");
    
}