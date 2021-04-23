// Modules
import { moveSync } from 'fs-extra';
import { Spinner } from 'cli-spinner';
// Types
import { SpinnerList } from '../types/cli';

export function moveSyncVerbose(from, to): void {
    const spinner = new Spinner(`Moving generated files to "${to}"`)
        .setSpinnerString(SpinnerList.LOW)
        .start();
    moveSync(from, to);
    spinner.stop(!!'clear');
}