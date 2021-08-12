#!/usr/bin/env node

// Libs
import { parseCliArguments } from './src/utils/arguments';
import { clone as gitClone } from './src/utils/git';
import { testOutputFiles } from './src/utils/checks';
import { confirmBeforeRemove } from './src/utils/storage';
// Types
import { ArgumentsList } from './src/types/argument';
import { SpinnerList } from './src/types/cli';
// Modules
import del from 'del';
import colors from 'colors';
import path from 'path';
import execa from 'execa';
import { Spinner } from 'cli-spinner';
import { existsSync, readFileSync } from 'fs-extra';
import { runner as hygen, Logger } from 'hygen';

export async function main(): Promise<void> {
    const argumentsList: ArgumentsList = parseCliArguments();
    const templatesPath: string = path.join(__dirname, '_templates/');
    if (existsSync(templatesPath)) {
        del.sync(templatesPath);
    }
    await confirmBeforeRemove(argumentsList.output);
    await gitClone({
        url: argumentsList.url,
        destination: templatesPath,
        username: argumentsList.username,
        publicKey: argumentsList.publicKey ? readFileSync(argumentsList.publicKey).toString() : '',
        privateKey: argumentsList.privateKey ? readFileSync(argumentsList.privateKey).toString() : '',
        credentials: argumentsList.credentials,
    });
    const generators: string[] = argumentsList.generator.split(',');

    console.log(colors.bold(`Found ${generators.length} hygen generators, taking off the plane ✈ ...`));
    for (const generator of generators) {
        await hygen(['generator', generator], {
            templates: templatesPath,
            cwd: argumentsList.output,
            logger: new Logger(() => ''),
            createPrompter: () => require('inquirer'),
            exec: async (action, body) => {
                const opts = body && body.length > 0 ? { input: body } : {};
                const spinner = new Spinner(action).setSpinnerString(SpinnerList.HARD).start();
                await execa.command(action, { ...opts, shell: true, cwd: argumentsList.output });
                spinner.stop(!!'clear');
            },
            debug: !!process.env.DEBUG,
        });
    }

    if (!existsSync(argumentsList.output)) {
        console.error('This generator did no generated any output files');
        process.exit(1);
    }

    testOutputFiles(generators, argumentsList.output);
}

if (!process.env.AVOID_AUTOSTART) {
    main();
}
