import { AstNode, Properties, ValidationAcceptor } from "langium";

export function acceptUpperCaseFirstLetter<T extends AstNode>(accept: ValidationAcceptor, name: string, target: T, prop?: Properties<T>): void {
    if ((name?.charAt(0).toUpperCase() != name?.charAt(0)) || name?.charAt(0) === '_') {
        const info = prop?{ node: target, property: prop }:{ node: target };
        accept('error', target.$type+' name must start with an upper case letter.', info)
    }
}

export function acceptMustContain<T extends AstNode>(what: string, accept: ValidationAcceptor, list: AstNode[], target: T, prop?: Properties<T>): void {
    if (list.length < 1) {
        const info = prop?{ node: target, property: prop }:{ node: target };
        accept('error', target.$type+' must contain '+what+'.', info);
    }
}

export function acceptNoDuplicateNames<T extends AstNode & {name: string}>(accept: ValidationAcceptor, list: T[], prop?: Properties<T>): void {
    const identifiers: string[] = [];
    list.forEach(item => {
        const id = item.name;
        if (identifiers.includes(id.toLocaleLowerCase())) {
            const info = prop?{ node: item, property: prop }:{ node: item };
            accept('error', item.$type+' name already defined.', info);
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

export function acceptMustNotContain<T extends AstNode>(what: string, accept: ValidationAcceptor, list: AstNode[], target: T, prop?: Properties<T>): void {
    if (list.length > 0) {
        const info = prop?{ node: target, property: prop }:{ node: target };
        accept('error', target.$type+' must not contain '+what+'.', info);
    }
}