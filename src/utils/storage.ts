// Modules
import del from 'del';
import { moveSync, existsSync } from 'fs-extra';
import { Spinner } from 'cli-spinner';
import { prompt } from 'enquirer';
// Types
import { SpinnerList } from '../types/cli';

export function moveSyncVerbose(from, to): void {
    const spinner = new Spinner(`Moving generated files to "${to}"`)
        .setSpinnerString(SpinnerList.LOW)
        .start();
    moveSync(from, to);
    spinner.stop(!!'clear');
}

export async function confirmBeforeRemove(path): Promise<void> {
    if (existsSync(path)) {
        const { remove } = await prompt({
            type: 'confirm',
            name: 'remove',
            message: `Are you sure you whant to remove ${path}?`
        }) as { remove: string };

        if (remove) {
            del.sync(path, { force: true })
        } else {
            process.exit(0);
        }
    }
}