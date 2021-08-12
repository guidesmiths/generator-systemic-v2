// Modules
import { isAbsolute } from 'path';

const errorMessages: {
    isNotAbsolutePath: (value: string) => Error;
} = {
    isNotAbsolutePath: (value: string): Error => new Error(`The provided value "${value}" is not an absolute path`),
};

export function isAbsolutePath(value: string): void {
    if (!isAbsolute(value)) {
        throw errorMessages.isNotAbsolutePath(value);
    }
}
