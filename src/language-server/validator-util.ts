import { AstNode, Properties, ValidationAcceptor } from "langium";

export function acceptUpperCaseFirstLetter<T extends AstNode>(accept: ValidationAcceptor, name: string, target: T, prop: Properties<T>): void {
    if ((name?.charAt(0).toUpperCase() != name?.charAt(0)) || name?.charAt(0) === '_') {
        accept('error', target.$type+' name must start with an upper case letter.', { node: target, property: prop })
    }
}

export function acceptMustContain<T extends AstNode>(what: string, accept: ValidationAcceptor, list: AstNode[], target: T, prop: Properties<T>): void {
    if (list.length < 1) {
        accept('error', target.$type+' must contain '+what+'.', { node: target, property: prop });
    }
}

export function acceptNoDuplicateNames<T extends AstNode & {name: string}>(accept: ValidationAcceptor, list: T[], prop: Properties<T>): void {
    const identifiers: string[] = [];
    list.forEach(item => {
        const id = item.name;
        if (identifiers.includes(id.toLocaleLowerCase())) {
            accept('error', item.$type+' name already defined', { node: item, property: prop});
        } else {
            identifiers.push(id.toLocaleLowerCase());
        }
    });
}

export function acceptUnique<T extends AstNode>(what: string, accept: ValidationAcceptor, list: T[]): void {
    if (list.length > 1) {
        for (let i = 1; i < list.length; i++) {
            accept('error', what+' already defined: you cannot declare more than one.', { node: list[i] });
        }
    }
}