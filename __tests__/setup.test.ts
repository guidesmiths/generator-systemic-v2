// Resources
process.env.AVOID_AUTOSTART = 'true';
// Modules
import path from 'path';
import { isArray } from 'lodash';
import { removeSync, mkdirSync, copySync, pathExistsSync, readFileSync } from 'fs-extra';
import { prompt, PromptModule } from 'inquirer';
jest.mock('inquirer');
// Libs
jest.mock('../src/utils/git');
import { clone as gitClone } from '../src/utils/git';
import { main } from '../setup';
// Dev types
import { TestConstants } from './@types/setup.type';
// Triggers
const mockedGitClone = gitClone as jest.Mock<Promise<void>>;
const mockedInquirerPrompt = prompt as unknown as jest.Mock<PromptModule>;

describe('Testing generated ouput files', () => {
    const outputPath: string = path.join(__dirname, 'tmp-output');
    const projectTemplateFolder: string = path.join(__dirname, '../_templates');
    const removeTemplatesFolder = () => removeSync(projectTemplateFolder);
    const constants: TestConstants = {
        promptCounter: 0,
        originalArgv: process.argv,
    };

    beforeAll(() => {
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        console.log = () => {};
        removeSync(outputPath);
        mkdirSync(outputPath);
    });

    beforeEach(() => {
        process.argv = constants.originalArgv.map((value: string) => value);
        constants.promptCounter = 0;
        removeTemplatesFolder();
    });

    afterEach(() => {
        removeTemplatesFolder();
        jest.clearAllMocks();
    });

    describe('should fail', () => {
        it('should fail if the output arguments is not an absolute path', async () => {
            let error: Error = new Error();
            process.argv.push(
                'template',
                '--url',
                'git@github.com:guidesmiths/gs-hygen-templates.git',
                '--generator',
                'docker-node-lts,nvm',
                '--output',
                'not/an/absolute/path',
            );
            try {
                await main();
            } catch (_error) {
                error = _error;
            }
            expect(error.message).toBe('The provided value "not/an/absolute/path" is not an absolute path');
        });
    });

    describe('should not fail', () => {
        it('should generate "docker-node-lts,nvm" templates output files', async () => {
            mockedGitClone.mockImplementation(async () => {
                copySync('./__tests__/templates/template_one', projectTemplateFolder);
            });
            mockedInquirerPrompt.mockImplementation((params): PromptModule => {
                const { name } = isArray(params) ? params[0] : params;
                if (name === 'fs_remove_confirm') {
                    return 'y' as never;
                } else if (name === 'npm_package_version') {
                    return { npm_package_version: 16 } as never;
                }
            });
            process.argv.push(
                'template',
                '--url',
                'git@github.com:guidesmiths/gs-hygen-templates.git',
                '--generator',
                'docker-node-lts,nvm',
                '--output',
                outputPath,
            );
            await main();
            expect(pathExistsSync(`${outputPath}/.dockerignore`)).toBeTruthy();
            expect(pathExistsSync(`${outputPath}/Dockerfile`)).toBeTruthy();
            expect(readFileSync(`${outputPath}/.nvmrc`, 'utf-8')).toBe('16\n');
        });
    });
});
