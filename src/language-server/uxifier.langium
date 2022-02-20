grammar Uxifier
hidden(WS, SL_COMMENT, ML_COMMENT)

Application:
    'character' ':' name=ID ';'
    (
    (fields+=FieldDecl)
    | ('config' configs+=Context)
    | ('game' games+=Context)
    )*
    ;

FieldDecl:
    'Field' name=ID ':' type=TYPE ';';

Context:
    name=ID (navigation=NAVIGATION)? '{' (pages+=PageDecl)* '}';

PageDecl:
    (skipable?='skipable')? (axe=AXE)? 'page' name=ID '{'
        (components+=(ButtonComponent | TextComponent | ImageComponent | FieldsComponent))*
    '}';

ButtonComponent:
    'Button' name=ID '(' (href=STRING (',' color=COLOR)?)? ')' ';' ;

TextComponent:
    'Text' name=ID '(' value=STRING (',' color=COLOR)? ')' ';' ;

ImageComponent:
    'Image' name=ID '(' source=STRING ')' ';' ;

FieldsComponent:
    'FieldGroup' name=ID '{' (decoFields+=DecoField)* '}' ;

DecoField:
    field=[FieldDecl|ID] ';';


TYPE returns string:
    'bool'|'number'|'string';
NAVIGATION returns string:
    'linear'|'side'|'bottom';
AXE returns string:
    'horizontal'|'vertical';
COLOR:
    value=HEXA_COLOR;



terminal WS: /\s+/;
terminal ID: /[_a-zA-Z][\w_]*/;
terminal INT returns number: /[0-9]+/;
terminal STRING: /"[^"]*"|'[^']*'/;
terminal HEXA_COLOR returns string: /\#[0-9a-f]+/;

terminal ML_COMMENT: /\/\*[\s\S]*?\*\//;
terminal SL_COMMENT: /\/\/[^\n\r]*/;
