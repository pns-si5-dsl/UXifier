import { ValidationAcceptor, ValidationCheck, ValidationRegistry } from 'langium';
import { Application, Context, COLOR, Page, UxifierAstType, FieldGroupComponent, ButtonComponent, StyleDecl, TextComponent, ImageComponent, PageArea, AreaLine, Component, CheckField_, IntField_, TextField_, SkillField_, StatField_, ComponentBoxComponent, SimpleDecoField, GaugeDecoField } from './generated/ast';
import { UxifierServices } from './uxifier-module';
import * as util from './validator-util';

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
        this.register({ CheckField_: validator.checkCheckField } as UxifierChecks, validator);
        this.register({ IntField_: validator.checkIntField } as UxifierChecks, validator);
        this.register({ StatField_: validator.checkStatField } as UxifierChecks, validator);
        this.register({ TextField_: validator.checkTextField } as UxifierChecks, validator);
        this.register({ SkillField_: validator.checkSkillField } as UxifierChecks, validator);
        this.register({ Page: validator.checkPage } as UxifierChecks, validator);
        this.register({ PageArea: validator.checkPageArea } as UxifierChecks, validator);
        this.register({ AreaLine: validator.checkAreaLine } as UxifierChecks, validator);
        this.register({ Context: validator.checkContext } as UxifierChecks, validator);
        this.register({ ComponentBoxComponent: validator.checkComponentBoxComponent } as UxifierChecks, validator);
        this.register({ ButtonComponent: validator.checkButtonComponent } as UxifierChecks, validator);
        this.register({ TextComponent: validator.checkTextComponent } as UxifierChecks, validator);
        this.register({ ImageComponent: validator.checkImageComponent } as UxifierChecks, validator);
        this.register({ FieldGroupComponent: validator.checkFieldsComponent } as UxifierChecks, validator);
        this.register({ StyleDecl: validator.checkStyle } as UxifierChecks, validator);
        this.register({ COLOR: validator.checkColorFormat } as UxifierChecks, validator);
    }
}

/**
 * Implementation of custom validations.
 */
export class UxifierValidator {

    checkApplication(application: Application, accept: ValidationAcceptor): void {
        util.acceptMustContain('a configuration', accept, application.configs, application, 'name');
        util.acceptMustContain('a game', accept, application.games, application, 'name');
        util.acceptUnique('configuration', accept, application.configs);
        util.acceptUnique('game', accept, application.games);
        util.acceptUpperCaseFirstLetter(accept, application.name, application, 'name');
        util.acceptNoDuplicateNames(accept, application.fields, 'name');
        
        const config: Context = application.configs[0];
        const game: Context = application.games[0];
        if(game && config) util.acceptNoDuplicateNames(accept, [config, game], 'name');
    }

    checkCheckField(field: CheckField_, accept: ValidationAcceptor): void {
        util.acceptUnique('description', accept, field.descriptions);
    }

    checkIntField(field: IntField_, accept: ValidationAcceptor): void {
        util.acceptUnique('min', accept, field.mins);
        util.acceptUnique('max', accept, field.maxs);
        if (!(field.mins[0] && field.maxs[0])) return;
        if (field.mins[0].value >= field.maxs[0].value) {
            accept('error', 'max value should not be lower than '+field.mins[0].value, { node: field.maxs[0], property: 'value' });
            accept('error', 'min value should not be higher than '+field.maxs[0].value, { node: field.mins[0], property: 'value' });
        }
    }

    checkStatField(field: StatField_, accept: ValidationAcceptor): void {
        util.acceptUnique('min', accept, field.mins);
        util.acceptUnique('max', accept, field.maxs);
        if (!(field.mins[0] && field.maxs[0])) return;
        if (field.mins[0].value >= field.maxs[0].value) {
            accept('error', 'max value should not be lower than '+field.mins[0].value, { node: field.maxs[0], property: 'value' });
            accept('error', 'min value should not be higher than '+field.maxs[0].value, { node: field.mins[0], property: 'value' });
        }
    }

    checkTextField(field: TextField_, accept: ValidationAcceptor): void {
        util.acceptUnique('min length', accept, field.minLengths);
        util.acceptUnique('max length', accept, field.maxLengths);
        util.acceptUnique('selection', accept, field.selections);
        util.acceptUnique('regex', accept, field.regexs);
        if (!(field.minLengths[0] && field.maxLengths[0])) return;
        if (field.minLengths[0].value >= field.maxLengths[0].value) {
            accept('error', 'max length value should not be lower than '+field.minLengths[0].value, { node: field.maxLengths[0], property: 'value' });
            accept('error', 'min length value should not be higher than '+field.maxLengths[0].value, { node: field.minLengths[0], property: 'value' });
        }
    }

    checkSkillField(field: SkillField_, accept: ValidationAcceptor): void {
        util.acceptUnique('description', accept, field.descriptions);
        util.acceptMustContain('an affect', accept, field.affects, field);
        util.acceptUnique('affect', accept, field.affects);
        const unrefStats = field.stats.map(r => r.value.ref).filter(s => s) as StatField_[];
        util.acceptMustContain('a stat', accept, unrefStats, field);
        util.acceptUnique('stat', accept, unrefStats);
    }

    checkContext(context: Context, accept: ValidationAcceptor): void {
        util.acceptMustContain('at least one page', accept, context.pages, context, 'name');
        util.acceptUpperCaseFirstLetter(accept, context.name, context, 'name');
        util.acceptNoDuplicateNames(accept, context.pages, 'name');
    }

    checkPage(page: Page, accept: ValidationAcceptor): void {
        util.acceptMustContain('at least one component', accept, page.components, page, 'name');
        util.acceptUpperCaseFirstLetter(accept, page.name, page, 'name');
        util.acceptNoDuplicateNames(accept, page.components, 'name');
        if (page.grid) {
            util.acceptMustContain('an area declaration', accept, page.areas, page, 'grid');
            util.acceptUnique('area', accept, page.areas);
        }
        else util.acceptMustNotContain('an area declaration', accept, page.areas, page, 'name')
    }

    checkPageArea(area: PageArea, accept: ValidationAcceptor): void {
        util.acceptMustContain('at least one line', accept, area.lines, area);
    }

    checkAreaLine(line: AreaLine, accept: ValidationAcceptor): void {
        const unrefComponents = line.components.map(r => r.ref).filter(c => c) as Component[];
        util.acceptMustContain('at least one component', accept, unrefComponents, line);
    }

    checkComponentBoxComponent(component: ComponentBoxComponent, accept: ValidationAcceptor): void {
        util.acceptUnique('title', accept, component.titles);
        util.acceptMustContain('at least one component', accept, component.components, component, 'name');
        util.acceptNoDuplicateNames(accept, component.components, 'name');
    }

    checkButtonComponent(component: ButtonComponent, accept: ValidationAcceptor): void {
        util.acceptMustContain('a label', accept, component.titles, component, 'name');
        util.acceptUnique('label', accept, component.titles);
        util.acceptUnique('href', accept, component.hrefs);
        util.acceptUnique('type', accept, component.types);
        util.acceptUnique('style', accept, component.styles);
    }

    checkTextComponent(component: TextComponent, accept: ValidationAcceptor): void {
        util.acceptMustContain('a content', accept, component.contents, component, 'name');
        util.acceptUnique('content', accept, component.contents);
        util.acceptUnique('title', accept, component.titles);
        util.acceptUnique('color', accept, component.colors);
        util.acceptUnique('title position', accept, component.titlePositions);
        util.acceptUnique('style', accept, component.styles);
    }

    checkImageComponent(component: ImageComponent, accept: ValidationAcceptor): void {
        util.acceptMustContain('a source', accept, component.sources, component, 'name');
        util.acceptUnique('source', accept, component.sources);
        util.acceptUnique('legend', accept, component.titles);
        util.acceptUnique('legend position', accept, component.titlePositions);
        util.acceptUnique('style', accept, component.styles);
    }

    checkFieldsComponent(component: FieldGroupComponent, accept: ValidationAcceptor): void {
        util.acceptUnique('title', accept, component.titles);
        util.acceptUnique('title position', accept, component.titlePositions);
        util.acceptUnique('style', accept, component.styles);
        util.acceptMustContain('at least one decorated field', accept, component.decoFields, component, 'name');
    }

    checkSimpleDecoField(decoField: SimpleDecoField, accept: ValidationAcceptor): void {
        util.acceptUnique('style', accept, decoField.styles);
    }

    checkGaugeDecoField(decoField: GaugeDecoField, accept: ValidationAcceptor): void {
        util.acceptUnique('style', accept, decoField.styles);
        util.acceptMustContain('a high color', accept, decoField.highColors, decoField);
        util.acceptMustContain('a low color', accept, decoField.lowColors, decoField);
    }

    checkStyle(style: StyleDecl, accept: ValidationAcceptor): void {
        util.acceptUnique('width', accept, style.widths);
        util.acceptUnique('height', accept, style.heights);
        util.acceptUnique('direction', accept, style.directions);
        util.acceptUnique('border color', accept, style.borderColors);
        util.acceptUnique('border size', accept, style.borderSizes);
        util.acceptUnique('box color', accept, style.boxColors);
        util.acceptUnique('text color', accept, style.textColors);
        util.acceptUnique('shape', accept, style.shapes);
        util.acceptUnique('align', accept, style.aligns);
    }

    checkColorFormat(hexaColor: COLOR, accept: ValidationAcceptor): void {
        if (hexaColor.value.length != 4 && hexaColor.value.length != 7) {
            accept('error', 'Wrong hexadecimal color format.\nFormat exemples: #09f or #a5f5b0', { node: hexaColor });
        }
    }
}
