// Modules
import Git from 'nodegit';
import { isEmpty } from 'lodash';
// Types
import { Clone } from '../types/git';

export async function clone({ url, destination, username, publicKey, privateKey, credentials }: Clone): Promise<void> {
    !isEmpty(url) &&
        (await Git.Clone.clone(url, destination, {
            fetchOpts: {
                callbacks: {
                    credentials: async () => Git.Cred.sshKeyMemoryNew(username, publicKey, privateKey, credentials),
                },
            },
        }));
}
