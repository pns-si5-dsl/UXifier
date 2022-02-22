import { CompositeGeneratorNode, NL } from "langium";
import { Component, isButtonComponent, isFieldGroupComponent, isImageComponent, isTextComponent, TextComponent } from "../../language-server/generated/ast";
import { generateFieldGroup } from "./fieldGroup.generator";

export function generateComponent(component: Component, node: CompositeGeneratorNode): void {

    node.append("<Card margin='small' background='light-2' gridArea='", component.name, "'>", NL);
    if (component.titles[0]) {
        node.append(
            "<CardHeader pad='small' background='light-3'>", NL,
            "Ton Perso", NL,
            "</CardHeader>", NL
        );
    }
    node.append("<CardBody margin='small'>", NL);

    if (isFieldGroupComponent(component)) {
        generateFieldGroup(component, node);
    } else if (isButtonComponent(component)) {
        // TODO
    } else if (isTextComponent(component)) {
        generateTextComponent(component, node);
    } else if (isImageComponent(component)) {
        // TODO
    }

    node.append(
        "</CardBody>", NL,
        "</Card>", NL
    );

}

function generateTextComponent(text: TextComponent, node: CompositeGeneratorNode): void {
    // TODO
}