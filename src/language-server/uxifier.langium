grammar Uxifier                     // Grammar name
hidden(WS, SL_COMMENT, ML_COMMENT)  // Ignore spaces and comments

// ==== MAIN RULE ====
CharSheet:
    'charSheet' ':' name=ID ';'     // Define the name of the application
    // Use list attributes in OR statement to handle unordered lists
    // and customise errors.
    // "because Unordered groups are currently not supported" - Langium.
    ( (fields+=Field)               // List of fields (variables of the character sheet)
    | ('config' configs+=Context)   // The character configuration phase (one)
    | ('game' games+=Context) )*    // The character game phase (one)
    ;




/* ###################################################

                        FIELDS

   ################################################### */

// ==== ABSTRACT FIELD ===
Field returns Field:
    (CheckField_|IntField_|StatField_|TextField_|SkillField_); // Concrete available fields

// ==== BOOLEAN CHECK FIELD ====
CheckField_:                                // Underscore after the name to avoid conflicts
    'CheckField' name=ID (('{'              // Type and name definition, body into braces
        ( (descriptions+=DescriptionDecl)   // The description declaration (one max)
        | (initials+=BoolInitDecl) )*       // The initial boolean declaration (one max) 
    '}') | ';') ;                           // Semicolon can be used instead of a body

// ==== INTEGER FIELD ====
IntField_:                                  // Underscore after the name to avoid conflicts
    'IntField' name=ID (('{'                // Type and name definition, body into braces
        ( (maxs+=MaxDecl)                   // The max integer declaration (one max)
        | (mins+=MinDecl)                   // The min integer declaration (one max)
        | (initials+=IntInitDecl) )*        // The initial integer declaration (one max)
    '}') | ';') ;                           // Semicolon can be used instead of a body

// ==== STATISTIC FIELD ====
StatField_:                                 // Underscore after the name to avoid conflicts
    'StatField' name=ID (('{'               // Type and name definition, body into braces
        ( (maxs+=MaxDecl)                   // The max integer declaration (one max)
        | (mins+=MinDecl)                   // The min integer declaration (one max)
        | (initials+=IntInitDecl) )*        // The initial integer declaration (one max)
    '}') | ';') ;                           // Semicolon can be used instead of a body

// ==== TEXT FIELD ====
TextField_:                                 // Underscore after the name to avoid conflicts
    'TextField' name=ID (('{'               // Type and name definition, body into braces
        ( (maxLengths+=MaxLengthDecl)       // The text maximum length declaration (one max) 
        | (minLengths+=MinLengthDecl)       // The text minimum length declaration (one max)
        | (selections+=SelectionDecl)       // The selection of possible texts declaration (one max)
        | (regexs+=RegexDecl)               // The regular expression format declaration (one max)
        | (initials+=StringInitDecl) )*     // The initial text declaration (one max)
    '}') | ';') ;                           // Semicolon can be used instead of a body

// ==== SKILL FIELD ====
SkillField_:                                // Underscore after the name to avoid conflicts
    'SkillField' name=ID '{'                // Type and name definition, body into braces
        ( (descriptions+=DescriptionDecl)   // The description declaration (one max)
        | (affects+=AffectDecl)             // The impact on the linked statistic declaration (one)
        | (stats+=StatDecl)                 // The linked statistic declaration (one)
        | (initials+=BoolInitDecl) )*       // The initial boolean declaration (one max)
    '}' ;  




/* ###################################################

                        CONTEXT

   ################################################### */

// ==== CONTEXT ===
Context:
    name=ID '{'                                         // Name definition, body into braces
        ('navigation' '=' navigation=NAVIGATION ';')?   // The navigation type (optional)
        (pages+=Page)*                                  // List of pages (one min)
    '}' ;




/* ###################################################

                        PAGE

   ################################################### */

// ==== PAGE ===
Page:
    (axis=AXIS)?                              // Display axe option [vertical or horizontal] (optional)
    'page' name=ID '{'                      // Name definition, body into braces
        ( (areas+=PageArea)                 // List of page areas for distinct screen sizes (optional)
        | (components+=Component) )*        // List of components displayed into the page (one min)
    '}' ;

// ==== PAGE GRID DISPOSITION ====
PageArea:
    (filled?='matchWindow')?                // Not scrollable page option (optional)
    (device=SCREEN_SIZE)?                   // Screen size option (optional)
    name='area' '{'                         // Name definition, body into braces
        (lines+=AreaLine)*                  // List of lines with the same size (one min)
    '}' ;

// ==== GRID LINE ====
AreaLine:
    '|' (components+=[Component|ID])* '|';  // List of component references (one min)




/* ###################################################

                        COMPONENTS

   ################################################### */

// ==== ABSTRACT COMPONENT ===
Component returns Component:
    (ButtonComponent|TextComponent|ImageComponent|FieldGroupComponent|ComponentBoxComponent|ItemListComponent);

// ==== BOX COMPONENT ====
ComponentBoxComponent:
    'BoxComponent' name=ID '{'              // Name definition, body into braces
        ( (titles+=TitleDecl)               // The title declaration (one max)
        | (titlePositions+=TitlePosDecl)    // The title position (one max)
        | (styles+=StyleDecl) )*            // The style declaration (one max)
        (components+=Component)*            // List of components (one min)
    '}' ;

// ==== BUTTON COMPONENT ====
ButtonComponent:
    'Button' name=ID '{'                    // Name definition, body into braces
        ( (titles+=LabelDecl)               // The label declaration (one)
        | (hrefs+=HrefDecl)                 // The link declaration (one max)
        | (types+=TypeDecl)                 // The button type declaration (one max)
        | (styles+=StyleDecl) )*            // The style declaration (one max)
    '}' ;

// ==== TEXT COMPONENT ====
TextComponent:
    'Text' name=ID '{'                      // Name definition, body into braces
        ( (contents+=ContentDecl)           // The content text declaration (one)
        | (titles+=TitleDecl)               // The title declaration (one max)
        | (titlePositions+=TitlePosDecl)    // The title position declaration (one max)
        | (colors+=ColorDecl)               // The text color declaration (one max)
        | (styles+=StyleDecl) )*            // The style declaration (one max)
    '}' ;

// ==== IMAGE COMPONENT ====
ImageComponent:
    'Image' name=ID '{'                     // Name definition, body into braces
        ( (sources+=SourceDecl)             // The image source link declaration (one)
        | (titles+=LegendDecl)              // The legend declaration (one max)
        | (titlePositions+=LegendPosDecl)   // The legend position declaration (one max)
        | (styles+=StyleDecl) )*            // The style declaration (one max)
    '}' ;

// ==== MULTIPLE FIELDS COMPONENT ====
FieldGroupComponent:
    'FieldGroup' name=ID '{'                // Name definition, body into braces
        ( (titles+=TitleDecl)               // The title declaration (one max)
        | (titlePositions+=TitlePosDecl)    // The title position declaration (one max)
        | (styles+=StyleDecl) )*            // The style declaration (one max)
        (decoFields+=DecoField)*            // List of decorated fields (one min)
    '}' ;

// ==== INVENTORY COMPONENT ====
ItemListComponent:
    'ListComponent' name=ID '{'             // Name definition, body into braces
        ( (titles+=TitleDecl)               // The title declaration (one max)
        | (titlePositions+=TitlePosDecl)    // The title position declaration (one max)
        | (styles+=StyleDecl) )*            // The style declaration (one max)
    '}' ;




/* ###################################################

                    DECORATED FIELDS

   ################################################### */

// ==== ABSTRACT DECORATED FIELD ===
DecoField returns DecoField:
    ((input?='input')|(output?='output'))       // Input or output decoration style (optional)
    decoField=(SimpleDecoField|GaugeDecoField); // Concrete available decorated fields

// ==== SIMPLE DECORATED FIELD ====
SimpleDecoField:
    'SimpleDecoration' field=[Field|ID] (('{'   // Type definition and field reference, body into braces
        ( (styles+=StyleDecl) )*                // The style declaration (one max)
    '}') | ';') ;                               // Semicolon can be used instead of a body

// ==== GAUGE DECORATED FIELD ====
GaugeDecoField:
    'GaugeDecoration' field=[Field|ID] (('{'    // Type definition and field reference, body into braces
        ( (styles+=StyleDecl)                   // The style declaration (one max)
        | (lowColors+=LowColorDecl)             // The low value color declaration (one max)
        | (highColors+=HighColorDecl) )*        // The high value color declaration (one max)
    '}') | ';') ; 




/* ###################################################

                        STYLE

   ################################################### */

// ==== STYLE ===
StyleDecl:
    'style' '{'                             // Body into braces
        ( (widths+=WidthDecl)               // Width declaration (one max)
        | (heights+=HeightDecl)             // Height declaration (one max)
        | (directions+=DirectionDecl)       // Direction declaration (one max)
        | (borderColors+=BorderColorDecl)   // Border color declaration (one max)
        | (borderSizes+=BorderSizeDecl)     // Border size declaration (one max)
        | (boxColors+=BoxColorDecl)         // Box color declaration (one max)
        | (textColors+=TextColorDecl)       // Text or title color declaration (one max)
        | (shapes+=ShapeDecl)               // Shape type declaration (one max)
        | (aligns+=AlignDecl) )*            // Alignment declaration (one max)
    '}' ;                              // Semicolon can be used instead of a body




/* ###################################################

                    DECLARATIONS

   ################################################### */

TitleDecl      returns TitleDecl:    'title'      '=' value=STRING               ';';
LegendDecl     returns TitleDecl:    'legend'     '=' value=STRING               ';';
LabelDecl      returns TitleDecl:    'label'      '=' value=STRING               ';';
ColorDecl      returns ColorDecl:    'color'      '=' value=COLOR                ';';
LowColorDecl   returns ColorDecl:    'lowColor'   '=' value=COLOR                ';';
HighColorDecl  returns ColorDecl:    'highColor'  '=' value=COLOR                ';';
BoolInitDecl   returns InitDecl:     'initial'    '=' value=BOOLEAN              ';';
IntInitDecl    returns InitDecl:     'initial'    '=' value=INT                  ';';
StringInitDecl returns InitDecl:     'initial'    '=' value=STRING               ';';
TitlePosDecl   returns TitlePosDecl: 'titlePos'   '=' value=TITLE_POS            ';';
LegendPosDecl  returns TitlePosDecl: 'legendPos'  '=' value=TITLE_POS            ';';
WidthDecl      returns SizeDecl:     'width'      '=' value=(SIZE|PIXEL|PERCENT) ';';
HeightDecl     returns SizeDecl:     'height'     '=' value=(SIZE|PIXEL|PERCENT) ';';
BorderSizeDecl returns SizeDecl:     'borderSize' '=' value=(SIZE|PIXEL|PERCENT) ';';
HrefDecl:        'href'        '=' value=STRING         ';';
TypeDecl:        'type'        '=' value=BUTTON_TYPE    ';';
ContentDecl:     'content'     '=' value=STRING         ';';
SourceDecl:      'source'      '=' value=STRING         ';';
DirectionDecl:   'direction'   '=' value=AXIS           ';';
BorderColorDecl: 'borderColor' '=' value=COLOR          ';';
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




/* ###################################################

                        TYPES

   ################################################### */

// (No terminals because of conflicts and to allow validation)

BOOLEAN returns string:
    ('true'|'false');
NAVIGATION returns string:
    ('linear'|'side_menu'|'bottom_menu');
AXIS returns string:
    ('horizontal'|'vertical');
BUTTON_TYPE returns string:
    ('primary'|'secondary');
SIZE returns string:
    ('xxsmall'|'xsmall'|'small'|'medium'|'large'|'xlarge'|'xxlarge'|'auto');
SHAPE returns string:
    ('rectangular'|'circular');
ALIGN returns string:
    ('left'|'right'|'center');
TITLE_POS returns string:
    ('left'|'top');
SCREEN_SIZE returns string:
    ('smallScreen'|'mediumScreen'|'largeScreen');
COLOR:
    value=HEXA_COLOR;




/* ###################################################

                        TERMINALS

   ################################################### */

terminal WS: /\s+/;
terminal ID: /[_a-zA-Z][\w_]*/;
terminal PIXEL returns string: /[0-9]+px/;
terminal PERCENT returns string : /[0-9]+%/;
terminal STRING: /"[^"]*"|'[^']*'/;
terminal HEXA_COLOR returns string: /#[0-9a-f]+/;
terminal INT returns number: /[0-9]+/;

terminal ML_COMMENT: /\/\*[\s\S]*?\*\//;
terminal SL_COMMENT: /\/\/[^\n\r]*/;
