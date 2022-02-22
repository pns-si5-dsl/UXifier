grammar Uxifier
hidden(WS, SL_COMMENT, ML_COMMENT)

Application:
    'character' ':' name=ID ';'
    ( (fields+=Field)
    | ('config' configs+=Context)
    | ('game' games+=Context) )*
    ;

Field returns Field:
    (CheckField_|IntField_|StatField_|TextField_|SkillField_);

CheckField_:
    'CheckField' name=ID '{'
        (descriptions+=DescriptionDecl)*
    '}' ;

IntField_:
    'IntField' name=ID '{'
        ( (maxs+=MaxDecl)
        | (mins+=MinDecl) )*
    '}' ;

StatField_:
    'StatField' name=ID '{'
        ( (maxs+=MaxDecl)
        | (mins+=MinDecl) )*
    '}' ;

TextField_:
    'TextField' name=ID '{'
        ( (maxLengths+=MaxLengthDecl)
        | (minLengths+=MinLengthDecl)
        | (selections+=SelectionDecl)
        | (regexs+=RegexDecl) )*
    '}' ;

SkillField_:
    'SkillField' name=ID '{'
        ( (descriptions+=DescriptionDecl)
        | (affects+=AffectDecl)
        | (stats+=StatDecl) )*
    '}' ;

Context:
    name=ID '{'
        ('navigation' '=' navigation=NAVIGATION ';')?
        (pages+=Page)*
    '}' ;

Page:
    (skipable?='skipable')? (axe=AXE)? (grid?='grid')? 'page' name=ID '{'
        ( (areas+=PageArea)
        | (components+=Component) )*
    '}' ;

PageArea:
    'area' '{'
        (lines+=AreaLine)*
    '}'
    ;

AreaLine:
    '|' (components+=[Component|ID])* '|';

Component returns Component:
    (ButtonComponent|TextComponent|ImageComponent|FieldGroupComponent);

ButtonComponent:
    'Button' name=ID '{'
        ( (titles+=TitleDecl)
        | (hrefs+=HrefDecl)
        | (types+=TypeDecl)
        | (styles+=StyleDecl) )*
    '}' ;

TextComponent:
    'Text' name=ID '{'
        ( (contents+=ContentDecl)
        | (titles+=TitleDecl)
        | (titlePositions+=TitlePosDecl)
        | (colors+=ColorDecl)
        | (styles+=StyleDecl) )*
    '}' ;

ImageComponent:
    'Image' name=ID '{'
        ( (sources+=SourceDecl)
        | (titles+=TitleDecl)
        | (titlePositions+=TitlePosDecl)
        | (styles+=StyleDecl) )*
    '}' ;

FieldGroupComponent:
    'FieldGroup' name=ID '{'
        ( (titles+=TitleDecl)
        | (titlePositions+=TitlePosDecl)
        | (styles+=StyleDecl) )*
        (decoFields+=DecoField)*
    '}' ;

StyleDecl:
    'style' '{'
        ( (widths+=WidthDecl)
        | (heights+=HeightDecl)
        | (directions+=DirectionDecl)
        | (borderColors+=BorderColorDecl)
        | (borderSizes+=BorderSizeDecl)
        | (boxColors+=BoxColorDecl)
        | (textColors+=TextColorDecl)
        | (shapes+=ShapeDecl)
        | (aligns+=AlignDecl) )*
    '}' ;

DecoField:
    field=[Field|ID] ';';

HrefDecl:        'href'        '=' value=STRING      ';';
TypeDecl:        'type'        '=' value=BUTTON_TYPE ';';
ContentDecl:     'content'     '=' value=STRING      ';';
TitleDecl:       'title'       '=' value=STRING      ';';
TitlePosDecl:    'titlePos'    '=' value=TITLE_POS   ';';
ColorDecl:       'color'       '=' value=COLOR       ';';
SourceDecl:      'source'      '=' value=STRING      ';';
WidthDecl:       'width'       '=' value=SIZE        ';';
HeightDecl:      'height'      '=' value=SIZE        ';';
DirectionDecl:   'direction'   '=' value=AXE         ';';
BorderColorDecl: 'borderColor' '=' value=COLOR       ';';
BorderSizeDecl:  'borderSize'  '=' value=SIZE        ';';
BoxColorDecl:    'boxColor'    '=' value=COLOR       ';';
TextColorDecl:   'textColor'   '=' value=COLOR       ';';
ShapeDecl:       'shape'       '=' value=SHAPE       ';';
AlignDecl:       'align'       '=' value=ALIGN       ';';
DescriptionDecl: 'description' '=' value=STRING      ';';
StatDecl:        'stat'        '=' value=[StatField_|ID] ';';
AffectDecl:      'affect'      '=' value=PERCENT     ';';
MaxLengthDecl:   'maxLength'   '=' value=INT         ';';
MinLengthDecl:   'minLength'   '=' value=INT         ';';
MaxDecl:         'max'         '=' value=INT         ';';
MinDecl:         'min'         '=' value=INT         ';';
RegexDecl:       'regex'       '=' value=STRING      ';';
SelectionDecl:   'selection'   '=' '[' (values+=STRING) (',' values+=STRING) ']' ';';

NAVIGATION:
    value=('linear'|'side_menu'|'bottom_menu');
AXE:
    value=('horizontal'|'vertical');
BUTTON_TYPE:
    value=('primary'|'secondary');
SIZE:
    value=('xxsmall'|'xsmall'|'small'|'medium'|'large'|'xlarge'|'xxlarge'|'auto'|PIXEL|PERCENT);
SHAPE:
    value=('rectangular'|'circular');
ALIGN:
    value=('left'|'right'|'center');
TITLE_POS:
    value=('left'|'top');
COLOR:
    value=HEXA_COLOR;


terminal WS: /\s+/;
terminal ID: /[_a-zA-Z][\w_]*/;
terminal PIXEL: /[0-9]+px/;
terminal PERCENT returns string : /[0-9]+%/;
terminal STRING: /"[^"]*"|'[^']*'/;
terminal HEXA_COLOR returns string: /#[0-9a-f]+/;
terminal INT returns number: /[0-9]+/;

terminal ML_COMMENT: /\/\*[\s\S]*?\*\//;
terminal SL_COMMENT: /\/\/[^\n\r]*/;
