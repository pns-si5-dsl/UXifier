grammar Uxifier
hidden(WS, SL_COMMENT, ML_COMMENT)

Application:
    'App' ':' name=ID ';'
    (fields+=FieldDecl)*
    ('Config' config=Context)?
    ('Game' game=Context)?
    ;

FieldDecl:
    'Field' name=ID ':' type=TYPE ';';

Context:
    name=ID '(' path=STRING (',' navigation=NAVIGATION)? ')' '{' (pages+=PageDecl)* '}';

PageDecl:
    (skipable?='skipable')? 'Page' name=ID '(' path=STRING (',' axe=AXE)? ')' '{' (components+=(ButtonComponent | TextComponent | ImageComponent | FieldsComponent))* '}';

ButtonComponent:
    'Button' name=ID '(' (href=STRING (',' color=COLOR)?)? ')' ';' ;

TextComponent:
    'Text' name=ID '(' value=STRING (',' color=COLOR)? ')' ';' ;

ImageComponent:
    'Image' name=ID '(' source=STRING ')' ';' ;

FieldsComponent:
    'Fields' name=ID '{' (decoFields+=DecoField)* '}' ;

DecoField:
    field=[FieldDecl|ID] ';';


TYPE:
    type=('bool'|'number'|'string');
NAVIGATION:
    type=('linear'|'side'|'bottom');
AXE:
    type=('horizontal'|'vertical');
COLOR:
    value=HEXA_COLOR;



terminal WS: /\s+/;
terminal ID: /[_a-zA-Z][\w_]*/;
terminal INT returns number: /[0-9]+/;
terminal STRING: /"[^"]*"|'[^']*'/;
terminal HEXA_COLOR returns string: /\#[0-9a-f]+/;

terminal ML_COMMENT: /\/\*[\s\S]*?\*\//;
terminal SL_COMMENT: /\/\/[^\n\r]*/;
