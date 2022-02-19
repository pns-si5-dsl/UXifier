import { CompositeGeneratorNode, NL } from "langium";
import { FieldsComponent } from "../../language-server/generated/ast";

export function generateFieldGroup(fieldGroup: FieldsComponent, node: CompositeGeneratorNode): void {

    node.append(
        "<Card margin='small' background='light-2'>", NL,
        "<CardHeader pad='small' background='light-3'>", NL,
        "Ton Perso", NL,
        "</CardHeader>", NL,
        "<CardBody margin='small'>", NL
    );

    fieldGroup.decoFields.forEach(decoField => {
        const field = decoField.field.ref;
        if (field) node.append(
            "<FormField name='", field?.name, "' htmlFor='", field.name, "-input' label='", field?.name, "'>", NL,
            "<TextInput id='", field?.name, "-input' name='", field?.name, "' placeholder='", field?.name, "'/>", NL,
            "</FormField>", NL
        );
    });

    node.append(
        "</CardBody>", NL,
        "<CardFooter>", NL,
        "</CardFooter>", NL,
        "</Card>", NL
    );

}