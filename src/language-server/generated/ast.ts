/******************************************************************************
 * This file was generated by langium-cli 0.2.0.
 * DO NOT EDIT MANUALLY!
 ******************************************************************************/

/* eslint-disable @typescript-eslint/array-type */
/* eslint-disable @typescript-eslint/no-empty-interface */
import { AstNode, AstReflection, Reference, isAstNode } from 'langium';

export interface AffectDecl extends AstNode {
    readonly $container: SkillField_;
    value: string
}

export const AffectDecl = 'AffectDecl';

export function isAffectDecl(item: unknown): item is AffectDecl {
    return reflection.isInstance(item, AffectDecl);
}

export interface ALIGN extends AstNode {
    readonly $container: AlignDecl;
    value: 'left' | 'right' | 'center'
}

export const ALIGN = 'ALIGN';

export function isALIGN(item: unknown): item is ALIGN {
    return reflection.isInstance(item, ALIGN);
}

export interface AlignDecl extends AstNode {
    readonly $container: StyleDecl;
    value: ALIGN
}

export const AlignDecl = 'AlignDecl';

export function isAlignDecl(item: unknown): item is AlignDecl {
    return reflection.isInstance(item, AlignDecl);
}

export interface Application extends AstNode {
    configs: Array<Context>
    fields: Array<Field>
    games: Array<Context>
    name: string
}

export const Application = 'Application';

export function isApplication(item: unknown): item is Application {
    return reflection.isInstance(item, Application);
}

export interface AreaLine extends AstNode {
    readonly $container: PageArea;
    components: Array<Reference<Component>>
}

export const AreaLine = 'AreaLine';

export function isAreaLine(item: unknown): item is AreaLine {
    return reflection.isInstance(item, AreaLine);
}

export interface AXE extends AstNode {
    readonly $container: Page | DirectionDecl;
    value: 'horizontal' | 'vertical'
}

export const AXE = 'AXE';

export function isAXE(item: unknown): item is AXE {
    return reflection.isInstance(item, AXE);
}

export interface BorderColorDecl extends AstNode {
    readonly $container: StyleDecl;
    value: COLOR
}

export const BorderColorDecl = 'BorderColorDecl';

export function isBorderColorDecl(item: unknown): item is BorderColorDecl {
    return reflection.isInstance(item, BorderColorDecl);
}

export interface BorderSizeDecl extends AstNode {
    readonly $container: StyleDecl;
    value: SIZE
}

export const BorderSizeDecl = 'BorderSizeDecl';

export function isBorderSizeDecl(item: unknown): item is BorderSizeDecl {
    return reflection.isInstance(item, BorderSizeDecl);
}

export interface BoxColorDecl extends AstNode {
    readonly $container: StyleDecl;
    value: COLOR
}

export const BoxColorDecl = 'BoxColorDecl';

export function isBoxColorDecl(item: unknown): item is BoxColorDecl {
    return reflection.isInstance(item, BoxColorDecl);
}

export interface BUTTON_TYPE extends AstNode {
    readonly $container: TypeDecl;
    value: 'primary' | 'secondary'
}

export const BUTTON_TYPE = 'BUTTON_TYPE';

export function isBUTTON_TYPE(item: unknown): item is BUTTON_TYPE {
    return reflection.isInstance(item, BUTTON_TYPE);
}

export interface COLOR extends AstNode {
    readonly $container: ColorDecl | BorderColorDecl | BoxColorDecl | TextColorDecl;
    value: string
}

export const COLOR = 'COLOR';

export function isCOLOR(item: unknown): item is COLOR {
    return reflection.isInstance(item, COLOR);
}

export interface ColorDecl extends AstNode {
    readonly $container: TextComponent | GaugeDecoField;
    value: COLOR
}

export const ColorDecl = 'ColorDecl';

export function isColorDecl(item: unknown): item is ColorDecl {
    return reflection.isInstance(item, ColorDecl);
}

export interface Component extends AstNode {
    readonly $container: Page | ComponentBoxComponent;
    name: string
    titles: Array<TitleDecl>
}

export const Component = 'Component';

export function isComponent(item: unknown): item is Component {
    return reflection.isInstance(item, Component);
}

export interface ContentDecl extends AstNode {
    readonly $container: TextComponent;
    value: string
}

export const ContentDecl = 'ContentDecl';

export function isContentDecl(item: unknown): item is ContentDecl {
    return reflection.isInstance(item, ContentDecl);
}

export interface Context extends AstNode {
    readonly $container: Application;
    name: string
    navigation: NAVIGATION
    pages: Array<Page>
}

export const Context = 'Context';

export function isContext(item: unknown): item is Context {
    return reflection.isInstance(item, Context);
}

export interface DecoField extends AstNode {
    readonly $container: FieldGroupComponent;
    input: boolean
    output: boolean
}

export const DecoField = 'DecoField';

export function isDecoField(item: unknown): item is DecoField {
    return reflection.isInstance(item, DecoField);
}

export interface DescriptionDecl extends AstNode {
    readonly $container: CheckField_ | SkillField_;
    value: string
}

export const DescriptionDecl = 'DescriptionDecl';

export function isDescriptionDecl(item: unknown): item is DescriptionDecl {
    return reflection.isInstance(item, DescriptionDecl);
}

export interface DirectionDecl extends AstNode {
    readonly $container: StyleDecl;
    value: AXE
}

export const DirectionDecl = 'DirectionDecl';

export function isDirectionDecl(item: unknown): item is DirectionDecl {
    return reflection.isInstance(item, DirectionDecl);
}

export interface Field extends AstNode {
    readonly $container: Application;
    name: string
}

export const Field = 'Field';

export function isField(item: unknown): item is Field {
    return reflection.isInstance(item, Field);
}

export interface GaugeDecoField extends AstNode {
    field: Reference<Field>
    highColors: Array<ColorDecl>
    lowColors: Array<ColorDecl>
    styles: Array<StyleDecl>
}

export const GaugeDecoField = 'GaugeDecoField';

export function isGaugeDecoField(item: unknown): item is GaugeDecoField {
    return reflection.isInstance(item, GaugeDecoField);
}

export interface HeightDecl extends AstNode {
    readonly $container: StyleDecl;
    value: SIZE
}

export const HeightDecl = 'HeightDecl';

export function isHeightDecl(item: unknown): item is HeightDecl {
    return reflection.isInstance(item, HeightDecl);
}

export interface HrefDecl extends AstNode {
    readonly $container: ButtonComponent;
    value: string
}

export const HrefDecl = 'HrefDecl';

export function isHrefDecl(item: unknown): item is HrefDecl {
    return reflection.isInstance(item, HrefDecl);
}

export interface LegendPosDecl extends AstNode {
    readonly $container: ImageComponent;
    value: TITLE_POS
}

export const LegendPosDecl = 'LegendPosDecl';

export function isLegendPosDecl(item: unknown): item is LegendPosDecl {
    return reflection.isInstance(item, LegendPosDecl);
}

export interface MaxDecl extends AstNode {
    readonly $container: IntField_ | StatField_;
    value: number
}

export const MaxDecl = 'MaxDecl';

export function isMaxDecl(item: unknown): item is MaxDecl {
    return reflection.isInstance(item, MaxDecl);
}

export interface MaxLengthDecl extends AstNode {
    readonly $container: TextField_;
    value: number
}

export const MaxLengthDecl = 'MaxLengthDecl';

export function isMaxLengthDecl(item: unknown): item is MaxLengthDecl {
    return reflection.isInstance(item, MaxLengthDecl);
}

export interface MinDecl extends AstNode {
    readonly $container: IntField_ | StatField_;
    value: number
}

export const MinDecl = 'MinDecl';

export function isMinDecl(item: unknown): item is MinDecl {
    return reflection.isInstance(item, MinDecl);
}

export interface MinLengthDecl extends AstNode {
    readonly $container: TextField_;
    value: number
}

export const MinLengthDecl = 'MinLengthDecl';

export function isMinLengthDecl(item: unknown): item is MinLengthDecl {
    return reflection.isInstance(item, MinLengthDecl);
}

export interface NAVIGATION extends AstNode {
    readonly $container: Context;
    value: 'linear' | 'side_menu' | 'bottom_menu'
}

export const NAVIGATION = 'NAVIGATION';

export function isNAVIGATION(item: unknown): item is NAVIGATION {
    return reflection.isInstance(item, NAVIGATION);
}

export interface Page extends AstNode {
    readonly $container: Context;
    areas: Array<PageArea>
    axe: AXE
    components: Array<Component>
    grid: boolean
    name: string
    skipable: boolean
}

export const Page = 'Page';

export function isPage(item: unknown): item is Page {
    return reflection.isInstance(item, Page);
}

export interface PageArea extends AstNode {
    readonly $container: Page;
    lines: Array<AreaLine>
}

export const PageArea = 'PageArea';

export function isPageArea(item: unknown): item is PageArea {
    return reflection.isInstance(item, PageArea);
}

export interface RegexDecl extends AstNode {
    readonly $container: TextField_;
    value: string
}

export const RegexDecl = 'RegexDecl';

export function isRegexDecl(item: unknown): item is RegexDecl {
    return reflection.isInstance(item, RegexDecl);
}

export interface SelectionDecl extends AstNode {
    readonly $container: TextField_;
    values: Array<string>
}

export const SelectionDecl = 'SelectionDecl';

export function isSelectionDecl(item: unknown): item is SelectionDecl {
    return reflection.isInstance(item, SelectionDecl);
}

export interface SHAPE extends AstNode {
    readonly $container: ShapeDecl;
    value: 'rectangular' | 'circular'
}

export const SHAPE = 'SHAPE';

export function isSHAPE(item: unknown): item is SHAPE {
    return reflection.isInstance(item, SHAPE);
}

export interface ShapeDecl extends AstNode {
    readonly $container: StyleDecl;
    value: SHAPE
}

export const ShapeDecl = 'ShapeDecl';

export function isShapeDecl(item: unknown): item is ShapeDecl {
    return reflection.isInstance(item, ShapeDecl);
}

export interface SimpleDecoField extends AstNode {
    field: Reference<Field>
    styles: Array<StyleDecl>
}

export const SimpleDecoField = 'SimpleDecoField';

export function isSimpleDecoField(item: unknown): item is SimpleDecoField {
    return reflection.isInstance(item, SimpleDecoField);
}

export interface SIZE extends AstNode {
    readonly $container: WidthDecl | HeightDecl | BorderSizeDecl;
    value: 'xxsmall' | 'xsmall' | 'small' | 'medium' | 'large' | 'xlarge' | 'xxlarge' | 'auto' | string | string
}

export const SIZE = 'SIZE';

export function isSIZE(item: unknown): item is SIZE {
    return reflection.isInstance(item, SIZE);
}

export interface SourceDecl extends AstNode {
    readonly $container: ImageComponent;
    value: string
}

export const SourceDecl = 'SourceDecl';

export function isSourceDecl(item: unknown): item is SourceDecl {
    return reflection.isInstance(item, SourceDecl);
}

export interface StatDecl extends AstNode {
    readonly $container: SkillField_;
    value: Reference<StatField_>
}

export const StatDecl = 'StatDecl';

export function isStatDecl(item: unknown): item is StatDecl {
    return reflection.isInstance(item, StatDecl);
}

export interface StyleDecl extends AstNode {
    readonly $container: ButtonComponent | TextComponent | ImageComponent | FieldGroupComponent | SimpleDecoField | GaugeDecoField;
    aligns: Array<AlignDecl>
    borderColors: Array<BorderColorDecl>
    borderSizes: Array<BorderSizeDecl>
    boxColors: Array<BoxColorDecl>
    directions: Array<DirectionDecl>
    heights: Array<HeightDecl>
    shapes: Array<ShapeDecl>
    textColors: Array<TextColorDecl>
    widths: Array<WidthDecl>
}

export const StyleDecl = 'StyleDecl';

export function isStyleDecl(item: unknown): item is StyleDecl {
    return reflection.isInstance(item, StyleDecl);
}

export interface TextColorDecl extends AstNode {
    readonly $container: StyleDecl;
    value: COLOR
}

export const TextColorDecl = 'TextColorDecl';

export function isTextColorDecl(item: unknown): item is TextColorDecl {
    return reflection.isInstance(item, TextColorDecl);
}

export interface TITLE_POS extends AstNode {
    readonly $container: TitlePosDecl | LegendPosDecl;
    value: 'left' | 'top'
}

export const TITLE_POS = 'TITLE_POS';

export function isTITLE_POS(item: unknown): item is TITLE_POS {
    return reflection.isInstance(item, TITLE_POS);
}

export interface TitleDecl extends AstNode {
    readonly $container: Component;
    value: string
}

export const TitleDecl = 'TitleDecl';

export function isTitleDecl(item: unknown): item is TitleDecl {
    return reflection.isInstance(item, TitleDecl);
}

export interface TitlePosDecl extends AstNode {
    readonly $container: TextComponent | FieldGroupComponent;
    value: TITLE_POS
}

export const TitlePosDecl = 'TitlePosDecl';

export function isTitlePosDecl(item: unknown): item is TitlePosDecl {
    return reflection.isInstance(item, TitlePosDecl);
}

export interface TypeDecl extends AstNode {
    readonly $container: ButtonComponent;
    value: BUTTON_TYPE
}

export const TypeDecl = 'TypeDecl';

export function isTypeDecl(item: unknown): item is TypeDecl {
    return reflection.isInstance(item, TypeDecl);
}

export interface WidthDecl extends AstNode {
    readonly $container: StyleDecl;
    value: SIZE
}

export const WidthDecl = 'WidthDecl';

export function isWidthDecl(item: unknown): item is WidthDecl {
    return reflection.isInstance(item, WidthDecl);
}

export interface ButtonComponent extends Component {
    hrefs: Array<HrefDecl>
    styles: Array<StyleDecl>
    types: Array<TypeDecl>
}

export const ButtonComponent = 'ButtonComponent';

export function isButtonComponent(item: unknown): item is ButtonComponent {
    return reflection.isInstance(item, ButtonComponent);
}

export interface ComponentBoxComponent extends Component {
    components: Array<Component>
}

export const ComponentBoxComponent = 'ComponentBoxComponent';

export function isComponentBoxComponent(item: unknown): item is ComponentBoxComponent {
    return reflection.isInstance(item, ComponentBoxComponent);
}

export interface FieldGroupComponent extends Component {
    decoFields: Array<DecoField>
    styles: Array<StyleDecl>
    titlePositions: Array<TitlePosDecl>
}

export const FieldGroupComponent = 'FieldGroupComponent';

export function isFieldGroupComponent(item: unknown): item is FieldGroupComponent {
    return reflection.isInstance(item, FieldGroupComponent);
}

export interface ImageComponent extends Component {
    sources: Array<SourceDecl>
    styles: Array<StyleDecl>
    titlePositions: Array<LegendPosDecl>
}

export const ImageComponent = 'ImageComponent';

export function isImageComponent(item: unknown): item is ImageComponent {
    return reflection.isInstance(item, ImageComponent);
}

export interface TextComponent extends Component {
    colors: Array<ColorDecl>
    contents: Array<ContentDecl>
    styles: Array<StyleDecl>
    titlePositions: Array<TitlePosDecl>
}

export const TextComponent = 'TextComponent';

export function isTextComponent(item: unknown): item is TextComponent {
    return reflection.isInstance(item, TextComponent);
}

export interface CheckField_ extends Field {
    descriptions: Array<DescriptionDecl>
}

export const CheckField_ = 'CheckField_';

export function isCheckField_(item: unknown): item is CheckField_ {
    return reflection.isInstance(item, CheckField_);
}

export interface IntField_ extends Field {
    maxs: Array<MaxDecl>
    mins: Array<MinDecl>
}

export const IntField_ = 'IntField_';

export function isIntField_(item: unknown): item is IntField_ {
    return reflection.isInstance(item, IntField_);
}

export interface SkillField_ extends Field {
    affects: Array<AffectDecl>
    descriptions: Array<DescriptionDecl>
    stats: Array<StatDecl>
}

export const SkillField_ = 'SkillField_';

export function isSkillField_(item: unknown): item is SkillField_ {
    return reflection.isInstance(item, SkillField_);
}

export interface StatField_ extends Field {
    maxs: Array<MaxDecl>
    mins: Array<MinDecl>
}

export const StatField_ = 'StatField_';

export function isStatField_(item: unknown): item is StatField_ {
    return reflection.isInstance(item, StatField_);
}

export interface TextField_ extends Field {
    maxLengths: Array<MaxLengthDecl>
    minLengths: Array<MinLengthDecl>
    regexs: Array<RegexDecl>
    selections: Array<SelectionDecl>
}

export const TextField_ = 'TextField_';

export function isTextField_(item: unknown): item is TextField_ {
    return reflection.isInstance(item, TextField_);
}

export type UxifierAstType = 'AffectDecl' | 'ALIGN' | 'AlignDecl' | 'Application' | 'AreaLine' | 'AXE' | 'BorderColorDecl' | 'BorderSizeDecl' | 'BoxColorDecl' | 'BUTTON_TYPE' | 'COLOR' | 'ColorDecl' | 'Component' | 'ContentDecl' | 'Context' | 'DecoField' | 'DescriptionDecl' | 'DirectionDecl' | 'Field' | 'GaugeDecoField' | 'HeightDecl' | 'HrefDecl' | 'LegendPosDecl' | 'MaxDecl' | 'MaxLengthDecl' | 'MinDecl' | 'MinLengthDecl' | 'NAVIGATION' | 'Page' | 'PageArea' | 'RegexDecl' | 'SelectionDecl' | 'SHAPE' | 'ShapeDecl' | 'SimpleDecoField' | 'SIZE' | 'SourceDecl' | 'StatDecl' | 'StyleDecl' | 'TextColorDecl' | 'TITLE_POS' | 'TitleDecl' | 'TitlePosDecl' | 'TypeDecl' | 'WidthDecl' | 'ButtonComponent' | 'ComponentBoxComponent' | 'FieldGroupComponent' | 'ImageComponent' | 'TextComponent' | 'CheckField_' | 'IntField_' | 'SkillField_' | 'StatField_' | 'TextField_';

export type UxifierAstReference = 'AreaLine:components' | 'GaugeDecoField:field' | 'SimpleDecoField:field' | 'StatDecl:value';

export class UxifierAstReflection implements AstReflection {

    getAllTypes(): string[] {
        return ['AffectDecl', 'ALIGN', 'AlignDecl', 'Application', 'AreaLine', 'AXE', 'BorderColorDecl', 'BorderSizeDecl', 'BoxColorDecl', 'BUTTON_TYPE', 'COLOR', 'ColorDecl', 'Component', 'ContentDecl', 'Context', 'DecoField', 'DescriptionDecl', 'DirectionDecl', 'Field', 'GaugeDecoField', 'HeightDecl', 'HrefDecl', 'LegendPosDecl', 'MaxDecl', 'MaxLengthDecl', 'MinDecl', 'MinLengthDecl', 'NAVIGATION', 'Page', 'PageArea', 'RegexDecl', 'SelectionDecl', 'SHAPE', 'ShapeDecl', 'SimpleDecoField', 'SIZE', 'SourceDecl', 'StatDecl', 'StyleDecl', 'TextColorDecl', 'TITLE_POS', 'TitleDecl', 'TitlePosDecl', 'TypeDecl', 'WidthDecl', 'ButtonComponent', 'ComponentBoxComponent', 'FieldGroupComponent', 'ImageComponent', 'TextComponent', 'CheckField_', 'IntField_', 'SkillField_', 'StatField_', 'TextField_'];
    }

    isInstance(node: unknown, type: string): boolean {
        return isAstNode(node) && this.isSubtype(node.$type, type);
    }

    isSubtype(subtype: string, supertype: string): boolean {
        if (subtype === supertype) {
            return true;
        }
        switch (subtype) {
            case ButtonComponent:
            case ComponentBoxComponent:
            case FieldGroupComponent:
            case ImageComponent:
            case TextComponent: {
                return this.isSubtype(Component, supertype);
            }
            case CheckField_:
            case IntField_:
            case SkillField_:
            case StatField_:
            case TextField_: {
                return this.isSubtype(Field, supertype);
            }
            default: {
                return false;
            }
        }
    }

    getReferenceType(referenceId: UxifierAstReference): string {
        switch (referenceId) {
            case 'AreaLine:components': {
                return Component;
            }
            case 'GaugeDecoField:field': {
                return Field;
            }
            case 'SimpleDecoField:field': {
                return Field;
            }
            case 'StatDecl:value': {
                return StatField_;
            }
            default: {
                throw new Error(`${referenceId} is not a valid reference id.`);
            }
        }
    }
}

export const reflection = new UxifierAstReflection();
