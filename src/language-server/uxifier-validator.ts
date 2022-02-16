import { ValidationAcceptor, ValidationCheck, ValidationRegistry } from 'langium';
import { Application, Context, COLOR, PageDecl, UxifierAstType, FieldsComponent } from './generated/ast';
import { UxifierServices } from './uxifier-module';

/**
 * Map AST node types to validation checks.
 */
type UxifierChecks = { [type in UxifierAstType]?: ValidationCheck | ValidationCheck[] }

/**
 * Registry for validation checks.
 */
export class UxifierValidationRegistry extends ValidationRegistry {
    constructor(services: UxifierServices) {
        super(services);
        const validator = services.validation.UxifierValidator;
        this.register({ Application: validator.checkApplication } as UxifierChecks, validator);
        this.register({ Context: validator.checkContext } as UxifierChecks, validator);
        this.register({ Page: validator.checkPage } as UxifierChecks, validator);
        this.register({ COLOR: validator.checkColorFormat } as UxifierChecks, validator);
    }
}

/**
 * Implementation of custom validations.
 */
export class UxifierValidator {

    

    checkApplication(application: Application, accept: ValidationAcceptor): void {
        if (!application.config) {
            accept('warning', 'An application should contain a configuration.', { node: application, property: 'name' });
        }
        if (!application.game) {
            accept('warning', 'An application should contain a game.', { node: application, property: 'name' });
        }

        const identifiers: string[] = [];
        application.fields.forEach(f => {
            const id = f.name;
            if (identifiers.includes(id)) {
                accept('error', 'Variable name already defined', { node: f, property: 'name'});
            } else {
                identifiers.push(id);
            }
        });

        if(application.game && application.config){
            if(application.game.name === application.config.name){
                accept('error', 'Contexts should have different names', { node: application.game, property: 'name' })
                accept('error', 'Contexts should have different names', { node: application.config, property: 'name' })
            }
        }
    }

    checkDuplicatedNames(application: Application, accept: ValidationAcceptor): void {
    }

    checkContext(context: Context, accept: ValidationAcceptor): void {
        if (context.pages.length == 0) {
            accept('error', 'A context must contain at least one page.', { node: context, property: 'name' });
        }

        const identifiers: string[] = [];
        context.pages.forEach(p => {
            const id = p.name;
            if (identifiers.includes(id)) {
                accept('error', 'Page name already defined', { node: p, property: 'name'});
            } else {
                identifiers.push(id);
            }
        });
    }

    checkPage(page: PageDecl, accept: ValidationAcceptor): void {
        if (page.components.length == 0) {
            accept('error', 'A page must contain at least one component.', { node: page, property: 'name' });
        }
    }

    checkField(component: FieldsComponent, accept: ValidationAcceptor): void {
        if (component.decoFields.length == 0) {
            accept('error', 'A fields component must contain at least one field.', { node: component, property: 'name' });
        }
    }

    checkColorFormat(hexaColor: COLOR, accept: ValidationAcceptor): void {
        if (hexaColor.value.length != 4 && hexaColor.value.length != 7) {
            accept('error', 'Wrong hexadecimal color format.\nFormat exemples: #09f or #a5f5b0', { node: hexaColor, property: 'value'});
        }
    }
}

