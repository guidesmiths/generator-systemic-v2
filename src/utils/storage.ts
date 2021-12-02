// Modules
import path from 'path';
import { tmpdir } from 'os';
import { moveSync } from 'fs-extra';
import { Spinner } from 'cli-spinner';
// Types
import { SpinnerList } from '../types/cli';

export function moveSyncVerbose(from: string, to: string): void {
    const spinner = new Spinner(`Moving generated files to "${to}"`).setSpinnerString(SpinnerList.LOW).start();
    moveSync(from, to);
    spinner.stop(!!'clear');
}

export function getTemplatesPath(): string {
    return path.join(tmpdir(), 'gs-hygen/templates/');
}
