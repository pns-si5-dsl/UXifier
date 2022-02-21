import { CompositeGeneratorNode, NL } from "langium";
import { isButtonComponent, isFieldGroupComponent, isImageComponent, isTextComponent, Page } from "../../language-server/generated/ast";
import { generateFieldGroup } from "./fieldGroup.generator";

export function generatePage(page: Page, nextPage: Page | undefined, modelName: string, node: CompositeGeneratorNode): void {
    
    node.append(
        NL, "export function ", page.name, "(props) {", NL,
        "const [state, dispatch] = React.useContext(PersoContext)", NL,
        "return (", NL,
        "<Form", NL,
        "margin='medium'", NL,
        "value={state}", NL,
        "onChange={nextValue => dispatch({type: 'up', value: nextValue})}", NL,
        "onReset={() => dispatch({type: 'reset', value: [", /*"'nom', 'age', 'taille', 'cheveux'",*/ "]})}", NL,
        "onSubmit={({value}) => {", NL,
        "}}", NL,
        ">", NL
    );


    page.components.forEach(component => {
        if (isFieldGroupComponent(component)) {
            generateFieldGroup(component, node);
        } else if (isButtonComponent(component)) {
            // TODO
        } else if (isTextComponent(component)) {
            // TODO
        } else if (isImageComponent(component)) {
            // TODO
        }
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