// Modules
import { readdirSync } from 'fs-extra';
import { prompt } from 'inquirer';
// Types
import { ArgumentsList } from '../types/argument';

export async function getGenerators(argumentsList: ArgumentsList, templatesPath: string): Promise<string[]> {
    return argumentsList.generator?.split(',') || selectGenerators(templatesPath);
}

async function selectGenerators(templatesPath: string): Promise<string[]> {
    const generatorObjects = readdirSync(`${templatesPath}/generator`, { withFileTypes: true });
    const generators = generatorObjects.filter((dirent) => dirent.isDirectory()).map(({ name }) => name);
    const values = await prompt({
        type: 'checkbox',
        name: 'generatorsNames',
        message: 'Choose one or multiple generators',
        choices: generators,
    });
    return values.generatorsNames;
}
