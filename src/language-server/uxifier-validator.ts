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
        this.register({ FieldsComponent: validator.checkFieldGroup } as UxifierChecks, validator);
        this.register({ COLOR: validator.checkColorFormat } as UxifierChecks, validator);
    }
}

/**
 * Implementation of custom validations.
 */
export class UxifierValidator {

    checkApplication(application: Application, accept: ValidationAcceptor): void {
        if (application.configs.length === 0) {
            accept('warning', 'An application should contain a configuration.', { node: application, property: 'name' });
        }
        if (application.games.length === 0) {
            accept('warning', 'An application should contain a game.', { node: application, property: 'name' });
        }
        if (application.configs.length > 1) {
            for (let i = 1; i < application.configs.length; i++) {
                accept('error', 'Config already defined: you cannot declare more than one Config.', { node: application.configs[i] });
            }
        }
        if (application.games.length > 1) {
            for (let i = 1; i < application.games.length; i++) {
                accept('error', 'Game already defined: you cannot declare more than one Game.', { node: application.games[i] });
            }
        }

        if (application.name?.charAt(0).toUpperCase() != application.name?.charAt(0)) {
            accept('error', 'The application name must start with an upper case.', { node: application, property: 'name' })
        }

        const identifiers: string[] = [];
        application.fields.forEach(f => {
            const id = f.name;
            if (identifiers.includes(id.toLocaleLowerCase())) {
                accept('error', 'Variable name already defined', { node: f, property: 'name'});
            } else {
                identifiers.push(id.toLocaleLowerCase());
            }
        });

        const config: Context | undefined = application.configs[0];
        const game: Context | undefined = application.games[0];
        
        if(game && config){
            if(game.name?.toLocaleLowerCase() === config.name?.toLocaleLowerCase()){
                accept('error', 'Contexts should have different names', { node: game, property: 'name' })
                accept('error', 'Contexts should have different names', { node: config, property: 'name' })
            }
        }
    }

    checkContext(context: Context, accept: ValidationAcceptor): void {
        if (context.pages.length == 0) {
            accept('error', 'A context must contain at least one page.', { node: context, property: 'name' });
        }

        if (context.name?.charAt(0).toUpperCase() != context.name?.charAt(0)) {
            accept('error', 'A context name must start with an upper case.', { node: context, property: 'name' })
        }

        const identifiers: string[] = [];
        context.pages.forEach(p => {
            const id = p.name;
            if (identifiers.includes(id.toLocaleLowerCase())) {
                accept('error', 'Page name already defined', { node: p, property: 'name'});
            } else {
                identifiers.push(id.toLocaleLowerCase());
            }
        });
    }

    checkPage(page: PageDecl, accept: ValidationAcceptor): void {
        if (page.components.length == 0) {
            accept('error', 'A page must contain at least one component.', { node: page, property: 'name' });
        }

        if (page.name?.charAt(0).toUpperCase() != page.name?.charAt(0)) {
            accept('error', 'A page name must start with an upper case.', { node: page, property: 'name' })
        }
    }

    checkFieldGroup(component: FieldsComponent, accept: ValidationAcceptor): void {
        if (component.decoFields.length == 0) {
            accept('error', 'A field group must contain at least one field.', { node: component, property: 'name' });
        }
    }

    checkColorFormat(hexaColor: COLOR, accept: ValidationAcceptor): void {
        if (hexaColor.value.length != 4 && hexaColor.value.length != 7) {
            accept('error', 'Wrong hexadecimal color format.\nFormat exemples: #09f or #a5f5b0', { node: hexaColor });
        }
    }
}

