// Modules
import path from 'path';
import del from 'del';
import { tmpdir } from 'os';
import { moveSync, existsSync } from 'fs-extra';
import { Spinner } from 'cli-spinner';
import { prompt } from 'inquirer';
// Types
import { SpinnerList } from '../types/cli';

export function moveSyncVerbose(from: string, to: string): void {
    const spinner = new Spinner(`Moving generated files to "${to}"`).setSpinnerString(SpinnerList.LOW).start();
    moveSync(from, to);
    spinner.stop(!!'clear');
}

export async function removePath(path: string, confirm = false): Promise<void> {
    if (existsSync(path)) {
        const remove =
            !confirm ||
            (await prompt({
                type: 'confirm',
                name: 'fs_remove_confirm',
                message: `Are you sure you want to remove ${path}?`,
            }));

        if (!remove) {
            process.exit(0);
        }

        del.sync(path, { force: true });
    }
}

export function getTemplatesPath(): string {
    return path.join(tmpdir(), 'gs-hygen/templates/');
}
