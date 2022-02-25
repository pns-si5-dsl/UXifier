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
        ( (descriptions+=DescriptionDecl)
        | (initials+=BoolInitDecl) )*
    '}' ;

IntField_:
    'IntField' name=ID '{'
        ( (maxs+=MaxDecl)
        | (mins+=MinDecl)
        | (initials+=IntInitDecl) )*
    '}' ;

StatField_:
    'StatField' name=ID '{'
        ( (maxs+=MaxDecl)
        | (mins+=MinDecl)
        | (initials+=IntInitDecl) )*
    '}' ;

TextField_:
    'TextField' name=ID '{'
        ( (maxLengths+=MaxLengthDecl)
        | (minLengths+=MinLengthDecl)
        | (selections+=SelectionDecl)
        | (regexs+=RegexDecl)
        | (initials+=StringInitDecl) )*
    '}' ;

SkillField_:
    'SkillField' name=ID '{'
        ( (descriptions+=DescriptionDecl)
        | (affects+=AffectDecl)
        | (stats+=StatDecl)
        | (initials+=BoolInitDecl) )*
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
    name='area' '{'
        (lines+=AreaLine)*
    '}'
    ;

AreaLine:
    '|' (components+=[Component|ID])* '|';

Component returns Component:
    (ButtonComponent|TextComponent|ImageComponent|FieldGroupComponent|ComponentBoxComponent);

ComponentBoxComponent:
    'BoxComponent' name=ID '{'
        ( (titles+=TitleDecl)
        | (titlePositions+=TitlePosDecl)
        | (styles+=StyleDecl) )*
        (components+=Component)*
    '}' ;

ButtonComponent:
    'Button' name=ID '{'
        ( (titles+=LabelDecl)
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
        | (titles+=LegendDecl)
        | (titlePositions+=LegendPosDecl)
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

DecoField returns DecoField:
    ((input?='input')|(output?='output')) decoField=(SimpleDecoField|GaugeDecoField);

SimpleDecoField:
    'SimpleDecoration' field=[Field|ID] '{'
        ( (styles+=StyleDecl) )*
    '}' ;

GaugeDecoField:
    'GaugeDecoration' field=[Field|ID] '{'
        ( (styles+=StyleDecl)
        | (lowColors+=LowColorDecl)
        | (highColors+=HighColorDecl) )*
    '}' ;

TitleDecl      returns TitleDecl: 'title'     '=' value=STRING  ';';
LegendDecl     returns TitleDecl: 'legend'    '=' value=STRING  ';';
LabelDecl      returns TitleDecl: 'label'     '=' value=STRING  ';';
ColorDecl      returns ColorDecl: 'color'     '=' value=COLOR   ';';
LowColorDecl   returns ColorDecl: 'lowColor'  '=' value=COLOR   ';';
HighColorDecl  returns ColorDecl: 'highColor' '=' value=COLOR   ';';
BoolInitDecl   returns InitDecl:  'initial'   '=' value=BOOLEAN ';';
IntInitDecl    returns InitDecl:  'initial'   '=' value=INT     ';';
StringInitDecl returns InitDecl:  'initial'   '=' value=STRING  ';';
HrefDecl:        'href'        '=' value=STRING         ';';
TypeDecl:        'type'        '=' value=BUTTON_TYPE    ';';
ContentDecl:     'content'     '=' value=STRING         ';';
TitlePosDecl:    'titlePos'    '=' value=TITLE_POS      ';';
LegendPosDecl:   'legendPos'   '=' value=TITLE_POS      ';';
SourceDecl:      'source'      '=' value=STRING         ';';
WidthDecl:       'width'       '=' value=SIZE           ';';
HeightDecl:      'height'      '=' value=SIZE           ';';
DirectionDecl:   'direction'   '=' value=AXE            ';';
BorderColorDecl: 'borderColor' '=' value=COLOR          ';';
BorderSizeDecl:  'borderSize'  '=' value=SIZE           ';';
BoxColorDecl:    'boxColor'    '=' value=COLOR          ';';
TextColorDecl:   'textColor'   '=' value=COLOR          ';';
ShapeDecl:       'shape'       '=' value=SHAPE          ';';
AlignDecl:       'align'       '=' value=ALIGN          ';';
DescriptionDecl: 'description' '=' value=STRING         ';';
StatDecl:        'stat'        '=' value=[StatField_|ID]';';
AffectDecl:      'affect'      '=' value=PERCENT        ';';
MaxLengthDecl:   'maxLength'   '=' value=INT            ';';
MinLengthDecl:   'minLength'   '=' value=INT            ';';
MaxDecl:         'max'         '=' value=INT            ';';
MinDecl:         'min'         '=' value=INT            ';';
RegexDecl:       'regex'       '=' value=STRING         ';';
SelectionDecl:   'selection'   '=' '[' ((values+=STRING) (',' values+=STRING)*)? ']' ';';

BOOLEAN returns string:
    ('true'|'false');
NAVIGATION returns string:
    ('linear'|'side_menu'|'bottom_menu');
AXE returns string:
    ('horizontal'|'vertical');
BUTTON_TYPE returns string:
    ('primary'|'secondary');
SIZE returns string:
    ('xxsmall'|'xsmall'|'small'|'medium'|'large'|'xlarge'|'xxlarge'|'auto'|PIXEL|PERCENT);
SHAPE returns string:
    ('rectangular'|'circular');
ALIGN returns string:
    ('left'|'right'|'center');
TITLE_POS returns string:
    ('left'|'top');
COLOR:
    value=HEXA_COLOR;


terminal WS: /\s+/;
terminal ID: /[_a-zA-Z][\w_]*/;
terminal PIXEL returns string: /[0-9]+px/;
terminal PERCENT returns string : /[0-9]+%/;
terminal STRING: /"[^"]*"|'[^']*'/;
terminal HEXA_COLOR returns string: /#[0-9a-f]+/;
terminal INT returns number: /[0-9]+/;

terminal ML_COMMENT: /\/\*[\s\S]*?\*\//;
terminal SL_COMMENT: /\/\/[^\n\r]*/;
