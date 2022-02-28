import { CompositeGeneratorNode, NL } from "langium";
import { Page } from "../../language-server/generated/ast";
import { generateComponent } from "./component.generator";
import { generateGridConst } from "./game-page.generator";

export function generateConfigPage(page: Page, nextPage: Page | undefined, modelName: string, node: CompositeGeneratorNode, endPath: string | undefined = undefined): void {
    
    node.append(
        NL, "export function ", page.name, "(props) {", NL,
        "const [state, dispatch] = React.useContext(PersoContext)", NL,
        "const [currentNewInvItem, setCurrentNewInvItem] = React.useState('');",NL,
    );
    if (page.areas[0]) generateGridConst(page, node);
    node.append(
        "return (", NL,
        "<Form", NL,
        "margin='medium'", NL,
        "value={state}", NL,
        "onChange={nextValue => dispatch({type: 'up', value: nextValue})}", NL,
        "onReset={() => dispatch({type: 'reset', value: [", /*"'nom', 'age', 'taille', 'cheveux'",*/ "]})}", NL, // TODO
        "onSubmit={({value}) => {", NL,
        "}}", NL,
        ">", NL
    );
    if (page.areas[0]) {
        node.append(
            "<Grid", NL,
            "areas={responsiveGrid[size]}",NL,
            "fill={responsiveFill[size]}", NL,
            ">", NL
        );
    }


    page.components.forEach(component => {
        generateComponent(component, node);
    });
    
    if (page.areas[0]) {
        node.append(
            "</Grid>", NL
        );
    }
    node.append("<Box direction='row' gap='medium' justify='end'>", NL);

    if(nextPage) {
        node.append(
            "<Link to='/", modelName, "/", nextPage.name, "'>", NL,
            "<Button type='submit' primary label='Next'/>", NL,
            "</Link>", NL,
        );
    } else if (endPath) {
        node.append(
            "<Link to='",endPath,"'>", NL,
                "<Button type='submit' primary label='Finish'/>", NL,
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