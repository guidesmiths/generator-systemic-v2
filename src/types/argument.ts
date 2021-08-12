import { PathLike } from 'fs-extra';

export interface ArgumentsList {
    generator: string;
    output: string;
    url?: string;
    username?: string;
    credentials?: string;
    publicKey?: PathLike;
    privateKey?: PathLike;
}
