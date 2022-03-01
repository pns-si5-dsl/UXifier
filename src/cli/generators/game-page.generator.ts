import { CompositeGeneratorNode, NL } from "langium";
import { Page } from "../../language-server/generated/ast";
import { generateComponent } from "./component.generator";

export function generateGamePage(page: Page, nextPage: Page | undefined, modelName: string, node: CompositeGeneratorNode): void {
    
    node.append(
        NL, "export function ", page.name, "(props) {", NL,
        "const [state, dispatch] = React.useContext(PersoContext)", NL,
        "const [currentNewInvItem, setCurrentNewInvItem] = React.useState('');",NL
    );
    if (page.areas[0]) generateGridConst(page, node);
    node.append(
        "return (", NL
    );

    if (page.areas[0]) {
        node.append(
            "<Grid", NL,
            "areas={responsiveGrid[size]}",NL,
            "fill={responsiveFill[size]}", NL,
            ">", NL
        );
    } else {
        node.append("<Box margin='medium' fill>", NL);
    }

            "small:"
    page.components.forEach(component => {
        generateComponent(component, node);
    });
    
    if(page.areas[0]) {
        node.append("</Grid>", NL);
    } else {
        node.append("</Box>", NL);
    }
    node.append(")}", NL);
}

export function generateGridConst(page: Page, node: CompositeGeneratorNode){
    const defaultGrid = page.areas.find((area) => !area.device) || page.areas[0];
    const smallGrid = page.areas.find((area) => area.device == 'smallScreen') || defaultGrid;
    const mediumGrid = page.areas.find((area) => area.device == 'mediumScreen') || defaultGrid;
    const largeGrid = page.areas.find((area) => area.device == 'largeScreen') || defaultGrid;

    node.append(
        "const size = React.useContext(ResponsiveContext);",NL,
    )
    node.append(
        "const responsiveGrid = {",NL,
            "small:[",NL
    );
    smallGrid.lines.forEach(line => {
        node.append("['", line.components.map(r => r.ref?.name).filter(e => e).join("','"), "'],", NL);
    });
    node.append(
            "],",NL,
            "medium:[",NL
    );
    mediumGrid.lines.forEach(line => {
        node.append("['", line.components.map(r => r.ref?.name).filter(e => e).join("','"), "'],", NL);
    });
    node.append(
            "],",NL,
            "large:[",NL
    );
    largeGrid.lines.forEach(line => {
        node.append("['", line.components.map(r => r.ref?.name).filter(e => e).join("','"), "'],", NL);
    });
    node.append(
            "],",NL,
        "};",NL
    )

    node.append(
        "const responsiveFill = {",NL,
            "small: ", String(smallGrid.filled), ",",NL,
            "medium: ",String(mediumGrid.filled),",",NL,
            "large: ", String(largeGrid.filled), ",",NL,
        "};",NL
    )
}