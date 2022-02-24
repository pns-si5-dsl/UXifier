import { CompositeGeneratorNode, NL } from "langium";
import { Component, isButtonComponent, isFieldGroupComponent, isImageComponent, isTextComponent, TextComponent, ImageComponent, isComponentBoxComponent, ComponentBoxComponent, ButtonComponent } from "../../language-server/generated/ast";
import { generateFieldGroup } from "./fieldGroup.generator";

export function generateComponent(component: Component, node: CompositeGeneratorNode): void {

    node.append("<Card margin='small' background='light-2' gridArea='", component.name, "'>", NL);
    if (component.titles[0]) {
        node.append(
          "<CardHeader pad='small' background='light-3'>", NL,
          component.titles[0].value, NL,
          "</CardHeader>", NL
        );
    }
    

    if (isFieldGroupComponent(component)) {
        generateFieldGroup(component, node);
    } else if (isButtonComponent(component)) {
        generateButtonComponent(component, node);
    } else if (isTextComponent(component)) {
        generateTextComponent(component, node);
    } else if (isImageComponent(component)) {
        generateImageComponent(component, node);
    } else if (isComponentBoxComponent(component)) {
        generateBoxComponent(component, node);
    }

    node.append(
        "</Card>", NL
    );

}

function generateTextComponent(text: TextComponent, node: CompositeGeneratorNode): void {
    node.append(
        "<CardBody margin='large'>", NL,
        "<Text>", NL,
        text.contents[0].value, NL,
        "</Text>", NL,
        "</CardBody>", NL
    );
}

function generateImageComponent(image: ImageComponent, node: CompositeGeneratorNode): void {
    node.append(
        "<Image fill src='",image.sources[0].value,"'/>", NL
    );
}

function generateBoxComponent(box: ComponentBoxComponent, node: CompositeGeneratorNode): void {
    node.append(
        "<CardBody margin='large'>", NL,
    ); 
    box.components.forEach((innerComp) => {
        generateComponent(innerComp, node);
    });
    node.append(
        "</CardBody>", NL
    );
}

function generateButtonComponent(button: ButtonComponent, node: CompositeGeneratorNode): void {
    const label = button.titles[0] ? "label='"+button.titles[0].value+"' " : "" ;
    const type = button.types[0] ? button.types[0].value+" " : "primary ";
    
    node.append(
        "<CardBody>", NL,
    );
    if(button.hrefs[0]){
        node.append("<Link to='",button.hrefs[0].value,"'>",NL);
    }
    node.append("<Button id='",button.name,"-button' ",type, label,"/>",NL)
    if(button.hrefs[0]){
        node.append("</Link>",NL);
    }
    node.append(
        "</CardBody>", NL
    );
}