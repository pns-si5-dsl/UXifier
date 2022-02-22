import { CompositeGeneratorNode, NL } from "langium";
import { Page } from "../../language-server/generated/ast";
import { generateComponent } from "./component.generator";

export function generateGamePage(page: Page, nextPage: Page | undefined, modelName: string, node: CompositeGeneratorNode): void {
    
    node.append(
        NL, "export function ", page.name, "(props) {", NL,
        "const [state, dispatch] = React.useContext(PersoContext)", NL,
        "return (", NL
    );

    if (page.grid) {
        node.append(
            "<Grid", NL,
            "fill gap=small", NL,
            "area={[", NL
        );
        page.areas[0]?.lines.forEach(line => {
            node.append("[", line.components.map(r => r.ref?.name).filter(e => e).join(' ,'), "],", NL);
        });
        node.append(
            "]}", NL,
            "", NL,
            "", NL,
            ">", NL
        );
    } else {
        node.append("<Box margin='medium' fill>", NL);
    }

    page.components.forEach(component => {
        generateComponent(component, node);
    });

    node.append("<Box direction='row' gap='medium' justify='end'>", NL);

    if(nextPage) {
        node.append(
            "<Link to='/", modelName, "/", nextPage.name, "'>", NL,
            "<Button type='submit' primary label='Next'/>", NL,
            "</Link>", NL,
        );
    }

    node.append(
        "<Button type='reset' label='Reset'/>", NL,
        "</Box>", NL,
        "</Form>", NL,
        ");", NL,
        "}", NL, NL
    );

}