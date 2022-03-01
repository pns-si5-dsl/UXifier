import { ValidationAcceptor, ValidationCheck, ValidationRegistry } from 'langium';
import { CharSheet, Context, COLOR, Page, UxifierAstType, FieldGroupComponent, ButtonComponent, StyleDecl, TextComponent, ImageComponent, PageArea, AreaLine, Component, CheckField_, IntField_, TextField_, SkillField_, StatField_, ComponentBoxComponent, SimpleDecoField, GaugeDecoField, isIntField_, isStatField_ } from './generated/ast';
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

        // Register every validation methods for the corresponding ast type
        this.register({ CharSheet: validator.checkCharSheet } as UxifierChecks, validator);
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
        this.register({ ItemListComponent: validator.checkItemListComponent } as UxifierChecks, validator);
        this.register({ FieldGroupComponent: validator.checkFieldsComponent } as UxifierChecks, validator);
        this.register({ StyleDecl: validator.checkStyle } as UxifierChecks, validator);
        this.register({ SimpleDecoField: validator.checkSimpleDecoField } as UxifierChecks, validator);
        this.register({ GaugeDecoField: validator.checkGaugeDecoField } as UxifierChecks, validator);
        this.register({ COLOR: validator.checkColorFormat } as UxifierChecks, validator);
    }
}

/**
 * Implementation of custom validations.
 */
export class UxifierValidator {

    checkCharSheet(charSheet: CharSheet, accept: ValidationAcceptor): void {

        // A CharSheet must contain one configuration phase
        util.acceptMustContain('a configuration', accept, charSheet.configs, charSheet, 'name');
        util.acceptUnique('configuration', accept, charSheet.configs);

        // A CharSheet must contain one game phase
        util.acceptMustContain('a game', accept, charSheet.games, charSheet, 'name');
        util.acceptUnique('game', accept, charSheet.games);

        // A CarSheet name must start with an upper case letter
        util.acceptUpperCaseFirstLetter(accept, charSheet.name, charSheet, 'name');

        // The fields of a CharSheet must have distinct names
        util.acceptNoDuplicateNames(accept, charSheet.fields, 'name');
        
        // The config and game phases must have different names
        const config: Context = charSheet.configs[0];
        const game: Context = charSheet.games[0];
        if(game && config) util.acceptNoDuplicateNames(accept, [config, game], 'name');

        config.pages.forEach(page => this.checkConfigPage(page, accept));
    }


    checkConfigPage(page: Page, accept: ValidationAcceptor): void {
        page.areas.forEach(area => {
            if (area.filled) {
                accept('error', 'Impossible use of the match parent option in the configuration context', { node: area, property: 'filled' });
            }
        })
    }


    checkCheckField(field: CheckField_, accept: ValidationAcceptor): void {
        util.acceptUnique('description', accept, field.descriptions);
        util.acceptUnique('initial', accept, field.initials);
    }


    checkIntField(field: IntField_, accept: ValidationAcceptor): void {
        util.acceptUnique('min', accept, field.mins);
        util.acceptUnique('max', accept, field.maxs);
        util.acceptUnique('initial', accept, field.initials);

        // verify min and max values consistency
        if (!(field.mins[0] && field.maxs[0])) return;
        if (field.mins[0].value >= field.maxs[0].value) {
            accept('error', 'max value should not be lower than '+field.mins[0].value, { node: field.maxs[0], property: 'value' });
            accept('error', 'min value should not be higher than '+field.maxs[0].value, { node: field.mins[0], property: 'value' });
        }
    }


    checkStatField(field: StatField_, accept: ValidationAcceptor): void {
        util.acceptUnique('min', accept, field.mins);
        util.acceptUnique('max', accept, field.maxs);
        util.acceptUnique('initial', accept, field.initials);

        // verify min and max values consistency
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
        util.acceptUnique('initial', accept, field.initials);

        // verify min and max values consistency
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
        util.acceptUnique('initial', accept, field.initials);

        // retrieve the list of referenced statistics
        const unrefStats = field.stats.map(r => r.value.ref).filter(s => s) as StatField_[];

        util.acceptMustContain('a stat', accept, unrefStats, field);
        util.acceptUnique('stat', accept, unrefStats);
    }


    checkContext(context: Context, accept: ValidationAcceptor): void {
        util.acceptMustContain('at least one page', accept, context.pages, context, 'name');
        util.acceptUpperCaseFirstLetter(accept, context.name, context, 'name');
        util.acceptNoDuplicateNames(accept, context.pages, 'name');

        // No page should have the same name as its context
        context.pages.forEach(page => {
            if (page.name.toLowerCase() === context.name.toLowerCase()) {
                accept('error', 'A page and its context must have different names.', { node: page, property: 'name' });
            }
        })

        // Unnecessary definition of a navigation for less than two pages
        if (context.navigation && context.pages.length < 2) {
            accept('info', 'Impossible navigation for less than 2 pages.', { node: context, property: 'navigation' });
        }
    }


    checkPage(page: Page, accept: ValidationAcceptor): void {
        util.acceptMustContain('at least one component', accept, page.components, page, 'name');
        util.acceptUpperCaseFirstLetter(accept, page.name, page, 'name');
        util.acceptNoDuplicateNames(accept, page.components, 'name');

        // Unnecessary axe definition overriden by an area definition
        if (page.axis && page.areas.length > 0) {
            accept('warning', 'Property overriden by an area definition.', { node: page, property: 'axis' });
        }

        // Areas must be defined for distinct screen sizes
        const devices: string[] = [];
        page.areas.forEach(area => {
            const device = area.device?area.device:'default';
            if (devices.includes(device.toLocaleLowerCase())) {
                accept('error', device+' area already defined.', { node: area, property: 'device' });
            } else {
                devices.push(device.toLocaleLowerCase());
            }
        });
    }


    checkPageArea(area: PageArea, accept: ValidationAcceptor): void {
        util.acceptMustContain('at least one line', accept, area.lines, area);

        // Lines of an area must all have the same length
        if (area.lines.length > 0) {
            const lineLengths = area.lines.map(l => l.components.length).reduce((res,i) => {
                if (!res.includes(i)) res.push(i);
                return res;
            }, new Array<number>());
            if (lineLengths.length > 1) {
                accept('error', 'Lines of an area must all have the same length: found lengthes '+lineLengths.toString(), { node: area, property: 'name' });
            }
        }

    }


    checkAreaLine(line: AreaLine, accept: ValidationAcceptor): void {
        
        // retrieve the list of referenced components
        const unrefComponents = line.components.map(r => r.ref).filter(c => c) as Component[];

        util.acceptMustContain('at least one component', accept, unrefComponents, line);
    }


    checkComponentBoxComponent(component: ComponentBoxComponent, accept: ValidationAcceptor): void {
        util.acceptUnique('title', accept, component.titles);
        util.acceptMustContain('at least one component', accept, component.components, component, 'name');
        util.acceptNoDuplicateNames(accept, component.components, 'name');
        util.acceptUnique('style', accept, component.styles);
        util.acceptUnique('title position', accept, component.titlePositions);
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


    checkItemListComponent(component: FieldGroupComponent, accept: ValidationAcceptor): void {
        util.acceptUnique('title', accept, component.titles);
        util.acceptUnique('title position', accept, component.titlePositions);
        util.acceptUnique('style', accept, component.styles);
    }


    checkSimpleDecoField(decoField: SimpleDecoField, accept: ValidationAcceptor): void {
        util.acceptUnique('style', accept, decoField.styles);
    }


    checkGaugeDecoField(decoField: GaugeDecoField, accept: ValidationAcceptor): void {
        util.acceptUnique('style', accept, decoField.styles);
        util.acceptUnique('high color', accept, decoField.highColors);
        util.acceptUnique('low color', accept, decoField.lowColors);

        // A GaugeDecoField can only be defined for an integer based field (IntField_ OR StatField_)
        if (!(isIntField_(decoField.field.ref) || isStatField_(decoField.field.ref))) {
            accept('error', 'A gauge decoration can only be used with an integer based field.', { node: decoField, property: 'field' });
        }
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
        
        // The hexa color format must be made of 3 or 6 hexa values
        if (hexaColor.value.length != 4 && hexaColor.value.length != 7) {
            accept('error', 'Wrong hexadecimal color format.\nFormat examples: #09f or #a5f5b0', { node: hexaColor });
        }
    }
}
