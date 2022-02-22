import { CompositeGeneratorNode, NL } from "langium";
import { Page } from "../../language-server/generated/ast";
import { generateComponent } from "./component.generator";

export function generateConfigPage(page: Page, nextPage: Page | undefined, modelName: string, node: CompositeGeneratorNode): void {
    
    node.append(
        NL, "export function ", page.name, "(props) {", NL,
        "const [state, dispatch] = React.useContext(PersoContext)", NL,
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